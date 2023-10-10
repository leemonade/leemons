const { getPermissionName } = require('../../../assignables/helpers/getPermissionName');
const { getUserPermission } = require('../getUserPermission');

/**
 * Removes a permission from a user.
 *
 * @param {Object} params - The parameters for removing the permission.
 * @param {string} params.assignable - The ID of the assignable.
 * @param {string} params.userAgent - The user agent.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Object} An object containing the user agent and the actions.
 */
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
      permissionName: getPermissionName({ id: assignable.id, prefix: true, ctx }),
      actionNames: actions,
    },
  });

  return {
    userAgent,
    actions,
  };
}

module.exports = { removePermissionFromUser };
