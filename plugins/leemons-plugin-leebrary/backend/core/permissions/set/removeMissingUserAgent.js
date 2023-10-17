const { LeemonsError } = require('@leemons/error');
const { getByAsset } = require('../getByAsset');
const canUnassignRole = require('../helpers/canUnassignRole');

/**
 * This function removes a missing user agent.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.id - The id of the asset involved.
 * @param {string} params.userAgent - The user agent whose permission should be removed.
 * @param {string} params.assignerRole - The role of the assigner.
 * @param {string} params.permissionName - The name of the permission.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<undefined>} - A promise that resolves when the user agent's permission has been removed.
 */

async function removeMissingUserAgent({ id, userAgent, assignerRole, permissionName, ctx }) {
  const { canAccessRole: assigneeRole } = await getByAsset({
    assetId: id,
    ctx: {
      ...ctx,
      meta: {
        ...ctx.meta,
        userSession: {
          userAgents: [{ id: userAgent }],
        },
      },
    },
  });

  // EN: Check if assigner can assign role to assignee
  // ES: Comprobar si el asignador puede asignar el rol al asignado
  if (assigneeRole !== 'owner') {
    if (!canUnassignRole({ userRole: assignerRole, assignedUserCurrentRole: assigneeRole, ctx })) {
      throw new LeemonsError(ctx, {
        message: "You don't have permission to unassign this role",
        httpStatusCode: 401,
      });
    }

    // Remove all permissions to the asset
    await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
      userAgentId: userAgent,
      data: {
        permissionName,
      },
    });
  }
}

module.exports = { removeMissingUserAgent };
