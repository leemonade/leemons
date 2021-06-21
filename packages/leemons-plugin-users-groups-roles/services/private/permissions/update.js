const _ = require('lodash');
const { table } = require('../tables');

/**
 * Update the permit only if the permissionName is already exist
 * @public
 * @static
 * @param {PermissionAdd} data - Array of permissions
 * @return {Promise<Permission>} Updated permission
 * */
async function update(data) {
  const permission = await table.permissions.count({
    permissionName: data.permissionName,
    pluginName: this.executeFrom,
  });
  if (!permission)
    throw new Error(
      `Permission '${data.permissionName}' for plugin '${this.executeFrom}' not exists`
    );

  leemons.log.info(`Updating permission '${data.permissionName}' for plugin '${this.executeFrom}'`);
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

module.exports = { update };
