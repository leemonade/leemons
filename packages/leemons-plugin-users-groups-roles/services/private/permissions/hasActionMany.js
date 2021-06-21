const { table } = require('../tables');

/**
 * Check if the permission has actions
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {string[]} actionNames - Action names
 * @return {Promise<boolean>}
 * */
async function hasActionMany(permissionName, actionNames) {
  const count = await table.permissionAction.count({
    permissionName,
    actionName_$in: actionNames,
  });
  return count === actionNames.length;
}

module.exports = { hasActionMany };
