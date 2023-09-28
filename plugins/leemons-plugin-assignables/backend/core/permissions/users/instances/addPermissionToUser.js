const { getPermissionName } = require('../../instances/helpers/getPermissionName');

async function addPermissionToUser({ assignableInstance, assignable, userAgents, role, ctx }) {
  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgentId: userAgents,
    data: {
      permissionName: getPermissionName({ assignableInstance, assignable, prefix: true, ctx }),
      actionNames: leemons.plugin.config.constants.assignableInstanceRolesObject[role].actions,
    },
  });

  return {
    userAgents,
    role,
    actions: leemons.plugin.config.constants.assignableInstanceRolesObject[role].actions,
  };
}

module.exports = { addPermissionToUser };
