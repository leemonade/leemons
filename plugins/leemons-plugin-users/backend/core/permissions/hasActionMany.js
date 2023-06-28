const constants = require('../../config/constants');

/**
 * Check if the permission has actions
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {string[]} actionNames - Action names
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function hasActionMany({ permissionName, actionNames, ctx }) {
  let count = await ctx.tx.db.PermissionAction.countDocuments({
    permissionName,
    actionName: actionNames,
  });
  if (
    constants.basicPermission.permissionName === permissionName &&
    actionNames.indexOf(constants.basicPermission.actionName) >= 0
  )
    count += 1;

  const result = count === actionNames.length;

  if (!result) {
    ctx.logger.log(`Permission '${permissionName}' doesn't have one of these actions:`);
    ctx.logger.dir(actionNames, { depth: null });
  }

  return result;
}

module.exports = { hasActionMany };
