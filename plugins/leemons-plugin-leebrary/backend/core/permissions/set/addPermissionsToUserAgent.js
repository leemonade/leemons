const { LeemonsError } = require('@leemons/error');
const { map } = require('lodash');

const { getByAsset } = require('../getByAsset');
const canAssignRole = require('../helpers/canAssignRole');

/**
 * This function gives a user agent permission for an asset.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.id - The id of the asset.
 * @param {string} params.role - The role to be assigned.
 * @param {string} params.userAgent - The user agent to be assigned the role.
 * @param {string} params.categoryId - The id of the asset category.
 * @param {string} params.assignerRole - The role of the assigner.
 * @param {string} params.permissionName - The name of the permission to be assigned.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} result - The promise that resolves to an array of results from assigning permissions to the user agent.
 */

async function addPermissionsToUserAgent({
  id,
  role,
  userAgent,
  categoryId,
  assignerRole,
  permissionName,
  removeAllPermissionsFromPreviousOwner = false,
  ctx,
}) {
  const result = [];
  const { canAccessRole: assigneeRole } = await getByAsset({
    assetId: id,
    ctx: { ...ctx, meta: { ...ctx.meta, userSession: { userAgents: [{ id: userAgent }] } } },
  });

  if (assigneeRole === role) return [];

  // EN: Check if assigner can assign role to assignee
  // ES: Comprobar si el asignador puede asignar el rol al asignado
  if (
    !canAssignRole({
      userRole: assignerRole,
      assignedUserCurrentRole: assigneeRole,
      newRole: role,
      ctx,
    })
  ) {
    throw new LeemonsError(ctx, {
      message: `You don't have permission to assign this role (assignerRole: ${JSON.stringify(
        assignerRole
      )}, assigneeRole: ${JSON.stringify(assigneeRole)}, newRole: ${JSON.stringify(role)})`,
      httpStatusCode: 401,
    });
  }

  // EN: When assigning owner role, replace current owner role by editor role
  // ES: Cuando se asigna el rol de propietario, reemplazar el rol de propietario actual por el rol de editor
  if (role === 'owner' && assignerRole === 'owner') {
    // First, remove all permissions to the asset
    await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
      userAgentId: map(ctx.meta.userSession.userAgents, 'id'),
      data: { permissionName },
    });

    // Then, add editor permission to the asset
    if (!removeAllPermissionsFromPreviousOwner) {
      result.push(
        await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
          userAgentId: map(ctx.meta.userSession.userAgents, 'id'),
          data: { permissionName, actionNames: ['editor'], target: categoryId },
        })
      );
    }
  }

  // First, remove all permissions to the asset
  await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
    userAgentId: userAgent,
    data: { permissionName },
  });

  try {
    // EN: Set role
    // ES: Asignar rol
    result.push(
      await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
        userAgentId: userAgent,
        data: { permissionName, actionNames: [role], target: categoryId },
      })
    );
  } catch (e) {
    ctx.logger.error(`Cannot assign custom permissions to UserAgent ${userAgent}: ${e.message}`);
  }
  return result;
}

module.exports = { addPermissionsToUserAgent };
