const { hasAction } = require('./hasAction');

async function existPermissionAction({ permissionName, actionName, ctx }) {
  return hasAction({ permissionName, actionName, ctx });
}

module.exports = { existPermissionAction };
