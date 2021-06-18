const { table } = require('../tables');

async function existPermissionAction(permissionName, actionName) {
  const response = await table.permissionAction.count({ permissionName, actionName });
  return !!response;
}

module.exports = { existPermissionAction };
