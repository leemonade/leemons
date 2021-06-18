const { table } = require('../tables');

/**
 * Delete the permit only if the permissionName is already exist
 * @public
 * @static
 * @param {string} permissionName - permissionName
 * @return {Promise<Permission>} Deleted permission
 * */
async function remove(permissionName) {
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

module.exports = { remove };
