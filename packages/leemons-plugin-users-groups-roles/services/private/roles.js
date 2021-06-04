const _ = require('lodash');
const constants = require('../../config/constants');

const table = {
  rolePermission: leemons.query('plugins_users-groups-roles::role-permission'),
  permissions: leemons.query('plugins_users-groups-roles::permissions'),
  role: leemons.query('plugins_users-groups-roles::roles'),
};

class Roles {
  /**
   * Creates the default roles that come with the leemons app
   * @public
   * @static
   * */
  static async init() {
    await Promise.all(
      _.map(constants.defaultRoles, (role) => this.createRole(role.name, role.permission))
    );
  }

  /**
   * Creates or updates a role based on whether the name is already in use
   * @public
   * @static
   * @param {string} name - Role name
   * @param {string[]} permissions - Array of permissions
   * @return {Promise<Role>} Crated / Updated role
   * */
  static async createRole(name, permissions) {
    return this.registerRole(null, name, permissions);
  }

  /**
   * Update the provided role
   * @public
   * @static
   * @param {string} id - Role id
   * @param {string[]} permissions - Array of permissions
   * @return {Promise<Role>} Crated / Updated role
   * */
  static async updateRole(id, permissions) {
    return this.registerRole(id, null, permissions);
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
   * @return {Promise<Role>} Crated / Updated role
   * */
  static async registerRole(id, name, permissions) {
    const values = await Promise.all([
      id ? table.role.findOne({ id }) : table.role.findOne({ name }),
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
          table.role.update({ id: role.id }, { name }, { transacting }),
          table.rolePermission.deleteMany({ role: role.id }, { transacting }),
        ]);
      } else {
        // If the role does not exist, we create it
        leemons.log.info(`Creating role '${name}'`);
        role = await table.role.create({ name }, { transacting });
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
}

module.exports = Roles;
