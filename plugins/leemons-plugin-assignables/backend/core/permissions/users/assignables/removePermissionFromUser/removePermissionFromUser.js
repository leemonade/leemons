const { getPermissionName } = require('../../../assignables/helpers/getPermissionName');
const { getUserPermission } = require('../getUserPermission');

async function removePermissionFromUser({ assignable, userAgent, ctx }) {
  ctx.meta.userSession = { userAgents: [userAgent] };
  const { actions } = await getUserPermission({
    assignableId: assignable,
    ctx: {
      ...ctx,
      meta: {
        ...ctx.meta,
        userSession: {
          ...ctx.meta.userSession,
          userAgents: [userAgent],
        },
      },
    },
  });

  await ctx.tx.call('users.permissions.removeCustomPermissionFromUserAgent', {
    userAgentId: userAgent.id,
    data: {
      permissionName: getPermissionName(assignable.id, { prefix: true }),
      actionNames: actions,
    },
  });

  return {
    userAgent,
    actions,
  };
}

module.exports = { removePermissionFromUser };
