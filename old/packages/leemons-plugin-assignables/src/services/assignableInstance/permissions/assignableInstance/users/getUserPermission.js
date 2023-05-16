const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getRoleMatchingActions = require('../getRoleMatchingActions');
const getTeacherPermission = require('./getTeacherPermission');

module.exports = async function getUserPermission(
  assignableInstance,
  { userSession, transacting } = {}
) {
  const permissions = await permission.getUserAgentPermissions(userSession.userAgents, {
    query: { permissionName_$contains: getPermissionName(assignableInstance) },
    transacting,
  });

  if (!permissions.length) {
    permissions.push(
      ...(await getTeacherPermission(assignableInstance, { userSession, transacting }))
    );
  }

  if (!permissions.length) {
    // TODO: Return no permissions (for the demo everything is public)
    return {
      role: 'viewer',
      actions: ['view'],
    };
    // return {
    //   role: null,
    //   actions: [],
    // };
  }

  return {
    role: getRoleMatchingActions(permissions[0].actionNames),
    actions: permissions[0].actionNames,
  };
};
