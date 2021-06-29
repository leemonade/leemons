const { table } = require('../tables');

/**
 * Check if permission exists
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {any} transacting - DB Permission
 * @return {Promise<boolean>}
 * */
async function exist(permissionName, { transacting }) {
  const response = await table.permissions.count({ permissionName }, { transacting });
  return !!response;
}

module.exports = { exist };
