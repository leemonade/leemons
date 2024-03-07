const constants = require('../../config/constants');

/**
 * Check if permission exists
 * @public
 * @static
 * @param {string[]} permissionNames - Permission names
 * @return {Promise<boolean>}
 * */
async function existMany({ permissionNames, ctx }) {
  let count = await ctx.tx.db.Permissions.countDocuments({ permissionName: permissionNames });
  if (permissionNames.indexOf(constants.basicPermission.permissionName) >= 0) count += 1;
  return count === permissionNames.length;
}

module.exports = { existMany };
