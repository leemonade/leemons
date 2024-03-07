const { LeemonsError } = require('@leemons/error');
const canUnassignRole = require('./helpers/canUnassignRole');
const getAssignerAndAssigneeRoles = require('./helpers/getAssignerAndAssigneeRoles');

/**
 * This function removes a role from a user.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.assetId - The ID of the asset from which to remove the role.
 * @param {string} params.assigneeAgent - The ID of the user from whom to remove the role.
 * @param {MoleculerContext} params.ctx - The context object containing additional information.
 * @throws {LeemonsError} When the assigner does not have permission to remove the role from the assignee, or when the role deletion fails.
 */
async function remove({ assetId, assigneeAgent, ctx } = {}) {
  try {
    const { userSession } = ctx.meta;

    // EN: Get assigner and assignee roles
    // ES: Obtener los roles del asignador y del asignado
    const { assignerRole, assigneeRole } = await getAssignerAndAssigneeRoles({
      assetId,
      assignerSession: userSession,
      assigneeId: assigneeAgent,
      ctx,
    });

    // EN: Check if assigner can remove role from assignee
    // ES: Comprobar si el asignador puede eliminar el rol del asignado
    if (
      !canUnassignRole({ userRole: assignerRole, assignedUserCurrentRole: assigneeRole, ctx: null })
    ) {
      throw new LeemonsError(ctx, {
        message: "You don't have permission to remove this role",
        httpStatusCode: 401,
      });
    }
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to delete role: ${e.message}`,
      httpStatusCode: 401,
    });
  }
}
module.exports = { remove };
