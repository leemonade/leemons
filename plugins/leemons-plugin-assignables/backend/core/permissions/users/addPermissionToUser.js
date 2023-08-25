const { assignableRolesObject } = require('../../../config/constants');
const { getPermissionName } = require('../assignables/helpers/getPermissionName');

async function addPermissionToUser({ id, userAgents, role, ctx }) {
  const { actions } = assignableRolesObject[role];
  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgentId: userAgents,
    data: {
      permissionName: getPermissionName({ id, prefix: true, ctx }),
      actionNames: actions,
    },
  });

  return {
    userAgents,
    role,
    actions,
  };
}

module.exports = { addPermissionToUser };
