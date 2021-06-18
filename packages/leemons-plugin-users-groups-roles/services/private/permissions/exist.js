const { table } = require('../tables');

/**
 * Check if permission exists
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @return {Promise<boolean>}
 * */
async function exist(permissionName) {
  const response = await table.permission.count({ permissionName });
  return !!response;
}

module.exports = { exist };
