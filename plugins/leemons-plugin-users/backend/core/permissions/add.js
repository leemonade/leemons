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
  let start = performance.now();
  validatePermissionName(data.permissionName, ctx.callerPlugin);
  let end = performance.now();
  console.log(`Execution time for validatePermissionName: ${end - start} ms`);

  start = performance.now();
  await validateExistPermission({ permissionName: data.permissionName, ctx });
  end = performance.now();
  console.log(`Execution time for validateExistPermission: ${end - start} ms`);

  ctx.logger.info(`Adding permission '${data.permissionName}' for plugin '${ctx.callerPlugin}'`);

  start = performance.now();
  const values = await Promise.all([
    ctx.tx.db.Permissions.create({
      permissionName: data.permissionName,
      pluginName: ctx.callerPlugin,
    }).then((mongooseDoc) => mongooseDoc.toObject()),
    ctx.tx.call('multilanguage.common.addManyByKey', {
      key: `users.${data.permissionName}.name`,
      data: data.localizationName,
    }),
  ]);
  end = performance.now();
  console.log(`Execution time for creating permission and adding localization: ${end - start} ms`);

  start = performance.now();
  await addActionMany({ permissionName: data.permissionName, actionNames: data.actions, ctx });
  end = performance.now();
  console.log(`Execution time for addActionMany: ${end - start} ms`);

  return values[0];
}

module.exports = { add };

