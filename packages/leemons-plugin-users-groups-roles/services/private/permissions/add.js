const { addActionMany } = require('./addActionMany');
const { table } = require('../tables');

/**
 * Create the permit only if the permissionName does not already exist.
 * @public
 * @static
 * @param {PermissionAdd} data - Array of permissions
 * @return {Promise<Permission>} Created permission
 * */
async function add(data) {
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
      // TODO Añadir que se añadan las traducciones
    ]);

    await addActionMany(data.permissionName, data.actions, transacting);

    return values[0];
  });
}

module.exports = { add };
