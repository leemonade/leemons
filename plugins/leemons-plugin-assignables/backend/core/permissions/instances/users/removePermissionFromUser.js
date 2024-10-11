const constants = require('../../../../config/constants');
const { getPermissionName } = require('../../instances/helpers/getPermissionName');

async function removePermissionFromUser({ assignableInstance, assignable, userAgents, role, ctx }) {
  const permissionName = getPermissionName({ assignableInstance, assignable, prefix: true, ctx });

  await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
    userAgentId: userAgents,
    data: {
      permissionName,
      actionNames: constants.assignableInstanceRolesObject[role].actions,
    },
  });

  return {
    userAgents,
    role,
    actions: constants.assignableInstanceRolesObject[role].actions,
  };
}

module.exports = { removePermissionFromUser };
