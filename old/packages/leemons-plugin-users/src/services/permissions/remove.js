const { translations } = require('../translations');
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
    pluginName: this.calledFrom,
  });
  if (!permission)
    throw new Error(`Permission '${permissionName}' for plugin '${this.calledFrom}' not exists`);

  leemons.log.info(`Deleting permission '${permissionName}' for plugin '${this.calledFrom}'`);
  return table.permissions.transaction(async (transacting) => {
    const promises = [
      table.permissions.delete(
        {
          permissionName,
          pluginName: this.calledFrom,
        },
        { transacting }
      ),
      table.permissionAction.deleteMany({ permissionName }, { transacting }),
    ];

    if (translations()) {
      promises.push(
        translations().common.deleteAll(
          { key: `plugins.users.${permissionName}.name` },
          { transacting }
        )
      );
    }

    const response = await Promise.all(promises);

    return response[0];
  });
}

module.exports = { remove };
