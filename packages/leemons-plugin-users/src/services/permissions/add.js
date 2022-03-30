const { validateExistPermission } = require('../../validations/exists');
const { validatePermissionName } = require('../../validations/exists');
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
  validatePermissionName(data.permissionName, this.calledFrom);

  await validateExistPermission(data.permissionName);

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
          `plugins.users.${data.permissionName}.name`,
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
