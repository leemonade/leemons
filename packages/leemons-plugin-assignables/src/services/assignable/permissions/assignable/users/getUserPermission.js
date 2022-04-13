const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');

module.exports = async function getUserPermission(assignable, { userSession, transacting } = {}) {
  // const { userAgents } = userSession;

  console.log(userSession);
  console.log(getPermissionName(assignable));
  const permissions = await permission.getUserAgentPermissions(userSession.userAgents, {
    query: { permissionName: getPermissionName(assignable) },
    transacting,
  });

  console.log('Permissions', permissions);
  // await Promise.all(
  //   userAgents.map(
  //     (userAgent) =>
  //       permission.addCustomPermissionToUserAgent(userAgent, {
  //         permissionName: getPermissionName(assignable),
  //         actionNames: leemons.plugin.config.constants.assignableRolesObject[role].actions,
  //       }),
  //     { transacting }
  //   )
  // );

  return { role, actions: leemons.plugin.config.constants.assignableRolesObject[role].actions };
};
