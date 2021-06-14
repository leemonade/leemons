const _ = require('lodash');
const constants = require('../../config/constants');

const table = {
  permissions: leemons.query('plugins_users-groups-roles::permissions'),
  permissionAction: leemons.query('plugins_users-groups-roles::permission-action'),
};

class Permissions {
  /**
   * Creates the default permissions that come with the leemons app
   * @public
   * @static
   * */
  static async init() {
    await Permissions.addMany.call(
      { executeFrom: 'users-groups-roles' },
      constants.defaultPermissions
    );
  }

  /**
   * Create the permit only if the permissionName does not already exist.
   * @public
   * @static
   * @param {PermissionAdd} data - Array of permissions
   * @return {Promise<Permission>} Created permission
   * */
  static async add(data) {
    const permission = await table.permissions.count({
      permissionName: data.permissionName,
      pluginName: this.executeFrom,
    });
    if (permission)
      throw new Error(
        `Permission '${data.permissionName}' for plugin '${this.executeFrom}' already exists`
      );

    leemons.log.info(`Adding permission '${data.permissionName}' for plugin '${this.executeFrom}'`);
    return table.permissions.transaction(async (transacting) => {
      const values = await Promise.all([
        table.permissions.create(
          {
            permissionName: data.permissionName,
            pluginName: this.executeFrom,
          },
          { transacting }
        ),
        table.permissionAction.createMany(
          _.map(data.actions, (actionName) => ({
            actionName,
            permissionName: data.permissionName,
          })),
          { transacting }
        ),
        // TODO Añadir que se añadan las traducciones
      ]);

      return values[0];
    });
  }

  /**
   * Create multiple permissions
   * @public
   * @static
   * @param {PermissionAdd[]} data - Array of permissions to add
   * @return {Promise<ManyResponse>} Created permissions
   * */
  static async addMany(data) {
    const response = await Promise.allSettled(_.map(data, (d) => Permissions.add(d)));
    return global.utils.settledResponseToManyResponse(response);
  }

  /**
   * Update the permit only if the permissionName is already exist
   * @public
   * @static
   * @param {PermissionAdd} data - Array of permissions
   * @return {Promise<Permission>} Updated permission
   * */
  static async update(data) {
    const permission = await table.permissions.count({
      permissionName: data.permissionName,
      pluginName: this.executeFrom,
    });
    if (!permission)
      throw new Error(
        `Permission '${data.permissionName}' for plugin '${this.executeFrom}' not exists`
      );

    leemons.log.info(
      `Updating permission '${data.permissionName}' for plugin '${this.executeFrom}'`
    );
    return table.permissions.transaction(async (transacting) => {
      await table.permissionAction.deleteMany({ permission: data.permissionName }, { transacting });
      await table.permissionAction.createMany(
        _.map(data.actions, (actionName) => ({
          actionName,
          permissionName: data.permissionName,
        })),
        { transacting }
      );
      // TODO Añadir que se actualicen las traducciones

      return table.permissions.findOne({
        permissionName: data.permissionName,
        pluginName: this.executeFrom,
      });
    });
  }

  /**
   * Update multiple permissions
   * @public
   * @static
   * @param {PermissionAdd[]} data - Array of permissions to update
   * @return {Promise<ManyResponse>} Updated permissions
   * */
  static async updateMany(data) {
    const response = await Promise.allSettled(_.map(data, (d) => Permissions.update(d)));
    return global.utils.settledResponseToManyResponse(response);
  }

  /**
   * Delete the permit only if the permissionName is already exist
   * @public
   * @static
   * @param {string} permissionName - permissionName
   * @return {Promise<Permission>} Deleted permission
   * */
  static async delete(permissionName) {
    const permission = await table.permissions.count({
      permissionName,
      pluginName: this.executeFrom,
    });
    if (!permission)
      throw new Error(`Permission '${permissionName}' for plugin '${this.executeFrom}' not exists`);

    leemons.log.info(`Deleting permission '${permissionName}' for plugin '${this.executeFrom}'`);
    return table.permissions.transaction(async (transacting) => {
      const response = await Promise.all([
        table.permissions.delete(
          {
            permissionName,
            pluginName: this.executeFrom,
          },
          { transacting }
        ),
        table.permissionAction.deleteMany({ permissionName }, { transacting }),
      ]);
      // TODO Añadir que se borren las traducciones
      return response[0];
    });
  }

  /**
   * Delete multiple permissions
   * @public
   * @static
   * @param {string[]} permissionNames - Array of permissions to delete
   * @return {Promise<ManyResponse>} Deleted permissions
   * */
  static async deleteMany(permissionNames) {
    const response = await Promise.allSettled(_.map(permissionNames, (d) => Permissions.delete(d)));
    return global.utils.settledResponseToManyResponse(response);
  }

  /**
   * Check if permission exists
   * @public
   * @static
   * @param {string} permissionName - Permission name
   * @return {Promise<boolean>}
   * */
  static async exist(permissionName) {
    return table.permission.count({ permissionName });
  }

  /**
   * Check if permission exists
   * @public
   * @static
   * @param {string[]} permissionNames - Permission names
   * @return {Promise<boolean>}
   * */
  static async existMany(permissionNames) {
    const count = await table.permission.count({ permissionName_$in: permissionNames });
    return count === permissionNames.length;
  }

  /**
   * Check if the permission has action
   * @public
   * @static
   * @param {string} permissionName - Permission name
   * @param {string} actionName - Action name
   * @return {Promise<boolean>}
   * */
  static async hasAction(permissionName, actionName) {
    return table.permissionAction.count({ permissionName, actionName });
  }

  /**
   * Check if the permission has actions
   * @public
   * @static
   * @param {string} permissionName - Permission name
   * @param {string[]} actionNames - Action names
   * @return {Promise<boolean>}
   * */
  static async hasActionMany(permissionName, actionNames) {
    const count = await table.permissionAction.count({
      permissionName,
      actionName_$in: actionNames,
    });
    return count === actionNames.length;
  }

  /**
   * Check if the many permission has many actions
   * @public
   * @static
   * @param {Array.<[string, Array.<string>]>} data
   * @return {Promise<boolean>}
   * */
  static async manyPermissionsHasManyActions(data) {
    const response = await Promise.all(_.map(data, (d) => Permissions.hasActionMany(d[0], d[1])));
    const result = _.uniq(response);
    return result.length > 1 ? false : result[0];
  }
}

module.exports = Permissions;
