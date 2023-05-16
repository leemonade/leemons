const { hasAction } = require('./hasAction');

async function existPermissionAction(permissionName, actionName, { transacting }) {
  return hasAction(permissionName, actionName, { transacting });
}

module.exports = { existPermissionAction };
