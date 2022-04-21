const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getRoleMatchingActions = require('../getRoleMatchingActions');
const getTeacherPermission = require('./getTeacherPermission');

module.exports = async function getUserPermission(
  assignableInstance,
  { userSession, transacting } = {}
) {
  const permissions = await permission.getUserAgentPermissions(userSession.userAgents, {
    query: { permissionName: getPermissionName(assignableInstance) },
    transacting,
  });

  if (!permissions.length) {
    permissions.push(
      ...(await getTeacherPermission(assignableInstance, { userSession, transacting }))
    );
  }

  return {
    role: getRoleMatchingActions(permissions[0].actionNames),
    actions: permissions[0].actionNames,
  };
};
