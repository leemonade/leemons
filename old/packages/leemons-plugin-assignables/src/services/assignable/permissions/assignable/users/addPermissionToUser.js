const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');

module.exports = async function addPermissionToUser(
  assignable,
  userAgents,
  role,
  { transacting } = {}
) {
  await permission.addCustomPermissionToUserAgent(
    userAgents,
    {
      permissionName: getPermissionName(assignable.id, { prefix: true }),
      actionNames: leemons.plugin.config.constants.assignableRolesObject[role].actions,
    },
    { transacting }
  );

  return {
    userAgents,
    role,
    actions: leemons.plugin.config.constants.assignableRolesObject[role].actions,
  };
};
