const { getAssignable } = require('../getAssignable');
const { getPermissionName } = require('../../permissions/assignables/helpers');
const { getUserPermission } = require('../../permissions/assignables/users/getUserPermission');
/**
 * List assignable user agents
 * @async
 * @function listAssignableUserAgents
 * @param {Object} params - The main parameter object.
 * @param {string} params.assignableId - The id of the assignable.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<Object>>} The list of user agents.
 */

async function listAssignableUserAgents({ assignableId, ctx }) {
  await getAssignable({ id: assignableId, ctx });

  // TODO: Check if the userSession has permission to list users :D
  // EN: Get the userAgents related with the assignable.
  // ES: Obtenemos los userAgents relacionados con el asignable.
  let users = await ctx.tx.call('users.permissions.findUserAgentsWithPermission', {
    permissions: { permissionName: getPermissionName({ id: assignableId, ctx }) },
  });

  // EN: Get the userAgents info.
  // ES: Obtenemos la información del userAgent.
  users = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: users,
  });

  // EN: Get the userAgents permissions.
  // ES: Obtenemos los permisos del userAgent.
  return Promise.all(
    users.map(async (user) => ({
      userAgent: user.id,
      ...(await getUserPermission({
        assignableId,
        ctx,
      })),
    }))
  );
}

module.exports = { listAssignableUserAgents };
