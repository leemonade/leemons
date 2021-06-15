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
  static async add({ name, permissions }) {
    const existRole = await table.roles.count({ name });
    if (existRole) throw new Error(`Role with name '${name}' already exists`);
    const dataToCheckPermissions = _.map(permissions, (permission) => [
      permission.permissionName,
      permission.actionNames,
    ]);
    if (!(await permissionsService.manyPermissionsHasManyActions(dataToCheckPermissions)))
      throw new Error(`One or more permissions or his actions not exist`);

    return table.roles.transaction(async (transacting) => {
      leemons.log.info(`Creating role '${name}'`);
      const role = await table.roles.create({ name }, { transacting });
      await Roles.addPermissionMany(role.id, permissions, transacting);
      return role;
    });
  }

  /**
   * Update one role
   * @private
   * @static
   * @param {RoleUpdate} data
   * @return {Promise<Role>} Created / Updated role
   * */
  static async update({ id, name, permissions }) {
    let existRole = await table.roles.count({ id });
    if (!existRole) throw new Error(`The role with the specified id does not exist`);

    existRole = await table.roles.count({ id_$ne: id, name });
    if (existRole) throw new Error(`Role with name '${name}' already exists`);

    const dataToCheckPermissions = _.map(permissions, (permission) => [
      permission.permissionName,
      permission.actionNames,
    ]);
    if (!(await permissionsService.manyPermissionsHasManyActions(dataToCheckPermissions)))
      throw new Error(`One or more permissions or his actions not exist`);

    return table.roles.transaction(async (transacting) => {
      leemons.log.info(`Creating role '${name}'`);
      const values = await Promise.all([
        Roles.deletePermissionAll(id, transacting),
        table.roles.update({ id }, { name }, { transacting }),
      ]);

      await Roles.addPermissionMany(id, permissions, transacting);
      return values[1];
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
   * @param {any} transacting - DB Transaction
   * @return {Promise<any>} Created permissions-roles
   * */
  static async addPermissionMany(roleId, permissions, transacting) {
    if (transacting) return Roles._addPermissionMany(roleId, permissions, transacting);
    return table.roles.transaction(async (transactin) =>
      Roles._addPermissionMany(roleId, permissions, transactin)
    );
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
   * @param {any} transacting - DB Transaction
   * @return {Promise<Role>} Created / Updated role
   * */
  static async deletePermissionAll(roleId, transacting) {
    if (transacting) return Roles._deletePermissionAll(roleId, transacting);
    return table.roles.transaction(async (transactin) =>
      Roles._deletePermissionAll(roleId, transactin)
    );
  }

  static async _deletePermissionAll(role, transacting) {
    return table.rolePermission.deleteMany({ role }, { transacting });
  }
}

module.exports = Roles;
