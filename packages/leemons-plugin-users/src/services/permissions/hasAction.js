const { table } = require('../tables');

/**
 * Check if the permission has action
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {string} actionName - Action name
 * @return {Promise<boolean>}
 * */
async function hasAction(permissionName, actionName) {
  return table.permissionAction.count({ permissionName, actionName });
}

module.exports = { hasAction };
