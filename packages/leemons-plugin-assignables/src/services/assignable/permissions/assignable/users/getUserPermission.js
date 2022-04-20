const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getRoleMatchingActions = require('../getRoleMatchingActions');

module.exports = async function getUserPermission(assignable, { userSession, transacting } = {}) {
  const permissions = await permission.getUserAgentPermissions(userSession.userAgents, {
    query: { permissionName: getPermissionName(assignable) },
    transacting,
  });

  return {
    role: getRoleMatchingActions(permissions[0].actionNames),
    actions: permissions[0].actionNames,
  };
};
