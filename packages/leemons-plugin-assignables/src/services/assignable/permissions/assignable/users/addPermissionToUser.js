const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getUserPermission = require('./getUserPermission');

module.exports = async function addPermissionToUser(
  assignable,
  userAgents,
  role,
  { userSession, transacting } = {}
) {
  const permissions = await permission.addCustomPermissionToUserAgent(
    userAgents,
    {
      permissionName: getPermissionName(assignable),
      actionNames: leemons.plugin.config.constants.assignableRolesObject[role].actions,
    },
    { transacting }
  );

  await getUserPermission(assignable, {
    userSession,
    transacting,
  });

  return { role, actions: leemons.plugin.config.constants.assignableRolesObject[role].actions };
};
