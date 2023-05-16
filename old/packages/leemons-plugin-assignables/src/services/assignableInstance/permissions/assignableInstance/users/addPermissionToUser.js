const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');

module.exports = async function addPermissionToUser(
  assignableInstance,
  assignable,
  userAgents,
  role,
  { transacting } = {}
) {
  await permission.addCustomPermissionToUserAgent(
    userAgents,
    {
      permissionName: getPermissionName(assignableInstance, { assignable, prefix: true }),
      actionNames: leemons.plugin.config.constants.assignableInstanceRolesObject[role].actions,
    },
    { transacting }
  );

  return {
    userAgents,
    role,
    actions: leemons.plugin.config.constants.assignableInstanceRolesObject[role].actions,
  };
};
