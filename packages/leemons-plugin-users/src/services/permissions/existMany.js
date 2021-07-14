const { table } = require('../tables');

/**
 * Check if permission exists
 * @public
 * @static
 * @param {string[]} permissionNames - Permission names
 * @return {Promise<boolean>}
 * */
async function existMany(permissionNames) {
  const count = await table.permission.count({ permissionName_$in: permissionNames });
  return count === permissionNames.length;
}

module.exports = { existMany };
