const { table } = require('../tables');
const constants = require('../../../config/constants');

/**
 * Check if permission exists
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {any} transacting - DB Permission
 * @return {Promise<boolean>}
 * */
async function exist(permissionName, { transacting }) {
  if (constants.basicPermission.permissionName === permissionName) return true;
  const response = await table.permissions.count({ permissionName }, { transacting });
  return !!response;
}

module.exports = { exist };
