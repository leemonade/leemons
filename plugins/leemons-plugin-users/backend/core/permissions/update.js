const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { addActionMany } = require('./addActionMany');

/**
 * Update the permit only if the permissionName is already exist
 * @public
 * @static
 * @param {PermissionAdd} data - Array of permissions
 * @return {Promise<Permission>} Updated permission
 * */
async function update({ ctx, ...data }) {
  const permission = await ctx.tx.db.Permissions.countDocuments({
    permissionName: data.permissionName,
    pluginName: ctx.callerPlugin,
  });
  if (!permission)
    throw new LeemonsError(ctx, {
      message: `Permission '${data.permissionName}' for plugin '${this.calledFrom}' not exists`,
    });

  ctx.logger.info(`Updating permission '${data.permissionName}' for plugin '${ctx.callerPlugin}'`);
  await ctx.tx.db.PermissionAction.deleteMany({ permissionName: data.permissionName });

  await addActionMany({ permissionName: data.permissionName, actionNames: data.actions, ctx });

  await ctx.tx.call('multilanguage.common.setKey', {
    key: `users.${data.permissionName}.name`,
    data: data.localizationName,
  });

  return ctx.tx.db.Permissions.findOne({
    permissionName: data.permissionName,
    pluginName: ctx.callerPlugin,
  }).lean();
}

module.exports = { update };
