const _ = require('lodash');
const constants = require('../../config/constants');
const permissionsService = require('./permissions');

const table = {
  rolePermission: leemons.query('plugins_users-groups-roles::role-permission'),
  permissions: leemons.query('plugins_users-groups-roles::permissions'),
  roles: leemons.query('plugins_users-groups-roles::roles'),
  userAuthRole: leemons.query('plugins_users-groups-roles::user-auth-role'),
  groupRole: leemons.query('plugins_users-groups-roles::group-role'),
  groupUserAuth: leemons.query('plugins_users-groups-roles::group-user-auth'),
};

class Roles {
  /**
   * Creates the default roles that come with the leemons app
   * @public
   * @static
   * */
  static async init() {
    await Promise.all(
      _.map(constants.defaultRoles, (role) => Roles.createRole(role.name, role.permissions))
    );
  }

  /**
   * Create one role
   * @private
   * @static
   * @param {RoleAdd} data
   * @return {Promise<Role>} Created / Updated role
   * */
  static async add(data) {
    const existRole = await table.roles.count({ name: data.name });
    if (existRole) throw new Error(`Role with name '${data.name}' already exists`);
    const dataToCheckPermissions = _.map(data.permissions, (permission) => [
      permission.permissionName,
      permission.actionNames,
    ]);
    if (!(await permissionsService.manyPermissionsHasManyActions(dataToCheckPermissions)))
      throw new Error(`One or more permissions or his actions not exist`);

    return table.roles.transaction(async (transacting) => {
      leemons.log.info(`Creating role '${data.name}'`);
      const role = await table.roles.create({ name: data.name }, { transacting });
      await Roles.addPermissionMany(role.id, data.permissions, transacting);
      return role;
    });
  }

  /**
   * Create one role
   * @private
   * @static
   * @param {RoleUpdate} data
   * @return {Promise<Role>} Created / Updated role
   * */
  static async update(data) {
    let existRole = await table.roles.count({ id: data.id });
    if (!existRole) throw new Error(`The role with the specified id does not exist`);

    existRole = await table.roles.count({ id_$ne: data.id, name: data.name });
    if (existRole) throw new Error(`Role with name '${data.name}' already exists`);

    const dataToCheckPermissions = _.map(data.permissions, (permission) => [
      permission.permissionName,
      permission.actionNames,
    ]);
    if (!(await permissionsService.manyPermissionsHasManyActions(dataToCheckPermissions)))
      throw new Error(`One or more permissions or his actions not exist`);

    return table.roles.transaction(async (transacting) => {
      leemons.log.info(`Creating role '${data.name}'`);
      const role = await table.roles.create({ name: data.name }, { transacting });
      await Roles.addPermissionMany(role.id, data.permissions, transacting);
      return role;
    });
  }

  /**
   * Creates or updates a role based on whether the name is already in use
   * @public
   * @static
   * @param {string} name - Role name
   * @param {string[]} permissions - Array of permissions
   * @return {Promise<Role>} Created / Updated role
   * */
  static async createRole(name, permissions) {
    return Roles.registerRole(null, name, permissions);
  }

  /**
   * Update the provided role
   * @public
   * @static
   * @param {string} id - Role id
   * @param {string[]} permissions - Array of permissions
   * @return {Promise<Role>} Created / Updated role
   * */
  static async updateRole(id, permissions) {
    return Roles.registerRole(id, null, permissions);
  }

  /**
   * Create / Update one role
   * If id is provided we update the role
   * If name is provided we check if already exist one role with this name, if exist we update if not we create it
   * @private
   * @static
   * @param {string=} id - Role id
   * @param {string=} name - Role name
   * @param {string[]} permissions - Array of permissions
   * @return {Promise<Role>} Created / Updated role
   * */
  static async registerRole(id, name, permissions) {
    const values = await Promise.all([
      id ? table.roles.findOne({ id }) : table.roles.findOne({ name }),
      table.permissions.count({ permissionName_$in: permissions }),
    ]);

    if (values[1] !== permissions.length)
      throw new Error('One or more of the permits do not exist');

    return table.rolePermission.transaction(async (transacting) => {
      let role = values[0];
      if (role) {
        // If the role already exists, we update its fields and delete its permissions and then create the new ones.
        leemons.log.info(`Updating role '${name}'`);
        await Promise.all([
          table.roles.update({ id: role.id }, { name }, { transacting }),
          table.rolePermission.deleteMany({ role: role.id }, { transacting }),
          Roles.searchUsersWithRoleAndMarkAsReloadPermissions(role.id, transacting),
        ]);
      } else {
        // If the role does not exist, we create it
        leemons.log.info(`Creating role '${name}'`);
        role = await table.roles.create({ name }, { transacting });
      }

      await table.rolePermission.createMany(
        _.map(permissions, (permission) => ({
          role: role.id,
          permission,
        })),
        { transacting }
      );

      return role;
    });
  }

  /**
   * Searches for the users that have that role, the groups that have that role and the users
   * that are in that groups.
   * @private
   * @static
   * @param {string} roleId - Role id
   * @param {any} transacting - Database transaction
   * @return {Promise<any>}
   * */
  static async searchUsersWithRoleAndMarkAsReloadPermissions(roleId, transacting) {
    const [userRoles, groupRoles] = await Promise.all([
      table.userRole.find({ role: roleId }, { columns: ['user'], transacting }),
      table.groupRole.find({ role: roleId }, { columns: ['group'], transacting }),
    ]);

    const groupUser = await table.groupUser.find(
      { group_$in: _.map(groupRoles, 'group') },
      { columns: ['user'], transacting }
    );

    const userIds = _.uniq(_.map(userRoles, 'user').concat(_.map(groupUser, 'user')));

    return table.users.updateMany(
      { id_$in: userIds },
      { reloadPermissions: true },
      { transacting }
    );
  }

  /**
   * Update the provided role
   * @public
   * @static
   * @param {string} roleId - Role id
   * @param {RolePermissionsAdd} permissions - Array of permissions
   * @param {any} transaction - DB Transaction
   * @return {Promise<any>} Created permissions-roles
   * */
  static async addPermissionMany(roleId, permissions, transaction) {
    if (transaction) return Roles._addPermissionMany(roleId, permissions, transaction);
    return table.roles.transaction(async (transacting) => {
      return Roles._addPermissionMany(roleId, permissions, transacting);
    });
  }

  static async _addPermissionMany(roleId, permissions, transacting) {
    const roleExist = await table.roles.count({ id: roleId });
    if (!roleExist) throw new Error('The role with the specified id does not exist');
    const items = [];
    _.forEach(permissions, (permission) => {
      _.forEach(permission.actionNames, (actionName) => {
        items.push({
          permissionName: permission.permissionName,
          actionName,
          target: permission.target,
          role: roleId,
        });
      });
    });
    return table.rolePermission.createMany(items, { transacting });
  }

  /**
   * Remove all permissions of role
   * @public
   * @static
   * @param {string} roleId - Role id
   * @param {any} transaction - DB Transaction
   * @return {Promise<Role>} Created / Updated role
   * */
  static async deletePermissionAll(roleId, transaction) {
    if (transaction) return Roles._deletePermissionAll(roleId, transaction);
    return table.roles.transaction(async (transacting) => {
      return Roles._deletePermissionAll(roleId, transacting);
    });
  }

  static async _deletePermissionAll(roleId, transaction) {
    if (transaction) return Roles._addPermissionMany(roleId, transaction);
    return table.roles.transaction(async (transacting) => {
      return Roles._addPermissionMany(roleId, transacting);
    });
  }
}

module.exports = Roles;
