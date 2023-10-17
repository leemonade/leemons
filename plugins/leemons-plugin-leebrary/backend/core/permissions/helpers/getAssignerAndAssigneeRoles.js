const { getByAsset } = require('../getByAsset');

/**
 * This function retrieves the roles of the assigner and assignee for a given asset.
 *
 * @param {string} assetId - The ID of the asset for which roles are to be retrieved.
 * @param {object} assignerSession - The session object of the assigner.
 * @param {string} assigneeId - The ID of the assignee.
 * @param {MoleculerContext} ctx - The context object containing additional information.
 * @returns {Promise<object>} An object containing the roles of the assigner and assignee.
 */
async function getAssignerAndAssigneeRoles({ assetId, assignerSession, assigneeId, ctx } = {}) {
  const permissions = await Promise.all([
    // EN: Get assigner role
    // ES: Obtener rol del asignador
    getByAsset({
      assetId,
      ctx: {
        ...ctx,
        meta: { ...ctx.meta, userSession: assignerSession },
      },
    }),
    // EN: Get assignee role
    // ES: Obtener rol del asignado
    getByAsset({
      assetId,
      ctx: {
        ...ctx,
        meta: {
          ...ctx.meta,
          userSession: {
            userAgents: [{ id: assigneeId }],
          },
        },
      },
    }),
  ]);

  return {
    assignerRole: permissions[0].role,
    assigneeRole: permissions[1].role,
  };
}

module.exports = getAssignerAndAssigneeRoles;
