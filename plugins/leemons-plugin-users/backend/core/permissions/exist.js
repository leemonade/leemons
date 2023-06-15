const constants = require('../../config/constants');

/**
 * Check if permission exists
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {any} transacting - DB Permission
 * @return {Promise<boolean>}
 * */
async function exist({ permissionName, ctx }) {
  if (constants.basicPermission.permissionName === permissionName) return true;
  const response = await ctx.tx.db.Permissions.countDocuments({ permissionName });
  return !!response;
}

module.exports = { exist };
