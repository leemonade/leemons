const { getTranslationKey } = require('../../../next/src/permissions/getTranslationKey');
const { translations } = require('../translations');
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
    pluginName: this.calledFrom,
  });

  if (!data.permissionName.startsWith(this.calledFrom))
    throw new Error(`The name of the permit must start with plugins.${this.calledFrom}`);

  if (permission)
    throw new Error(
      `Permission '${data.permissionName}' for plugin '${this.calledFrom}' already exists`
    );

  leemons.log.info(`Adding permission '${data.permissionName}' for plugin '${this.calledFrom}'`);
  return table.permissions.transaction(async (transacting) => {
    const promises = [
      table.permissions.create(
        {
          permissionName: data.permissionName,
          pluginName: this.calledFrom,
        },
        { transacting }
      ),
    ];

    if (translations()) {
      promises.push(
        translations().common.addManyByKey(
          getTranslationKey(data.permissionName, 'name'),
          data.localizationName,
          { transacting }
        )
      );
    }

    const values = await Promise.all(promises);

    await addActionMany(data.permissionName, data.actions, { transacting });

    return values[0];
  });
}

module.exports = { add };
