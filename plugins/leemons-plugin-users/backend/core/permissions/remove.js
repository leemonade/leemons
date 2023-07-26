const { LeemonsError } = require('leemons-error');

/**
 * Delete the permit only if the permissionName is already exist
 * @public
 * @static
 * @param {string} permissionName - permissionName
 * @return {Promise<Permission>} Deleted permission
 * */
async function remove({ permissionName, ctx }) {
  const permission = await ctx.tx.db.Permissions.countDocuments({
    permissionName,
    pluginName: ctx.callerPlugin,
  });
  if (!permission)
    throw new LeemonsError(ctx, {
      message: `Permission '${permissionName}' for plugin '${ctx.callerPlugin}' not exists`,
    });

  ctx.logger.info(`Deleting permission '${permissionName}' for plugin '${ctx.callerPlugin}'`);
  const promises = [
    ctx.tx.db.Permissions.deleteOne({
      permissionName,
      pluginName: ctx.callerPlugin,
    }),
    ctx.tx.db.PermissionAction.deleteMany({ permissionName }),
    ctx.tx.call('multilanguage.common.deleteAll', {
      key: `users.${permissionName}.name`,
    }),
  ];

  const response = await Promise.all(promises);

  return response[0];
}

module.exports = { remove };
