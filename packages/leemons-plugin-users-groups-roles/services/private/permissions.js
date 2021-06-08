const _ = require('lodash');
const constants = require('../../config/constants');

const table = {
  permissions: leemons.query('plugins_users-groups-roles::permissions'),
};

class Permissions {
  /**
   * Creates the default permissions that come with the leemons app
   * @public
   * @static
   * */
  static async init() {
    await Promise.all(
      _.map(constants.defaultPermissions, (permission) =>
        Permissions.registerPermission(
          permission.name,
          permission.permissionName,
          permission.pluginName
        )
      )
    );
  }

  /**
   * Create the permit only if the permissionName does not already exist, if it does, the existing one is returned.
   * @public
   * @static
   * @param {string} name - Role id
   * @param {string} permissionName - Role name
   * @param {string} pluginName - Array of permissions
   * @return {Promise<Permission>} Created permission
   * */
  static async registerPermission(name, permissionName, pluginName) {
    const permission = await table.permissions.findOne({ permissionName });
    if (!permission) {
      leemons.log.info(`Adding permission '${name}'`);
      return table.permissions.create({ name, permissionName, pluginName });
    }
    return permission;
  }
}

module.exports = Permissions;
