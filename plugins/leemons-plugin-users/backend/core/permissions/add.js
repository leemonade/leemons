const { validateExistPermission } = require('../../validations/exists');
const { validatePermissionName } = require('../../validations/exists');
const { addActionMany } = require('./addActionMany');

/**
 * Create the permit only if the permissionName does not already exist.
 * @public
 * @static
 * @param {PermissionAdd} data - Array of permissions
 * @return {Promise<Permission>} Created permission
 * */
async function add({ ctx, ...data }) {
  validatePermissionName(data.permissionName, ctx.callerPlugin);

  await validateExistPermission({ permissionName: data.permissionName, ctx });

  ctx.logger.info(`Adding permission '${data.permissionName}' for plugin '${ctx.callerPlugin}'`);

  const values = await Promise.all([
    ctx.tx.db.Permissions.create({
      permissionName: data.permissionName,
      pluginName: ctx.callerPlugin,
    }),
    ctx.tx.call('multilanguage.common.addManyByKey', {
      key: `users.${data.permissionName}.name`,
      data: data.localizationName,
    }),
  ]);

  await addActionMany({ permissionName: data.permissionName, actionNames: data.actions, ctx });

  return values[0];
}

module.exports = { add };
