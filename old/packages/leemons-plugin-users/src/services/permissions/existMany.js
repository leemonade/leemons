const { table } = require('../tables');
const constants = require('../../../config/constants');

/**
 * Check if permission exists
 * @public
 * @static
 * @param {string[]} permissionNames - Permission names
 * @return {Promise<boolean>}
 * */
async function existMany(permissionNames) {
  let count = await table.permissions.count({ permissionName_$in: permissionNames });
  if (permissionNames.indexOf(constants.basicPermission.permissionName) >= 0) count += 1;
  return count === permissionNames.length;
}

module.exports = { existMany };
