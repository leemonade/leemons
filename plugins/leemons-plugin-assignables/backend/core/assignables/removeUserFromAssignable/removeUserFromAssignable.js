const { LeemonsError } = require('@leemons/error');

const { assignableRolesObject } = require('../../../config/constants');

const { getAssignable } = require('../getAssignable');
const {
  getUserPermission,
} = require('../../permissions/assignables/users/getUserPermission');
const {
  removePermissionFromUser,
} = require('../../permissions/assignables/users/removePermissionFromUser');
/**
 * Remove a user from an assignable
 * @async
 * @function removeUserFromAssignable
 * @param {Object} params - The main parameter object.
 * @param {string} params.assignableId - The id of the assignable.
 * @param {Array<string>} params.userAgents - The user agents to remove.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<Object>>} The result of the removal.
 */

async function removeUserFromAssignable({ assignableId, userAgents, ctx }) {
  let assignable;
  let assignerRole;

  // EN: Check if user has access to the assignable
  // ES: Comprobar si el usuario tiene acceso al asignable
  try {
    assignable = await getAssignable({ id: assignableId, ctx });
    assignerRole = (await getUserPermission({ assignableId, ctx })).role;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `The assignable ${assignableId} does not exist or you don't have access to it.`,
    });
  }

  // EN: Check if the user has permissions to remove the user from the assignable
  // ES: Comprobar si el usuario tiene permisos para eliminar al usuario del asignable

  const userAgentsInfo = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: userAgents,
  });

  const assignableRoles = assignableRolesObject[assignerRole].canAssign;

  return Promise.all(
    userAgentsInfo.map(async (userAgent) => {
      const assignee = await getUserPermission({
        assignableId,
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

      if (!assignableRoles.includes(assignee.role)) {
        throw new LeemonsError(ctx, {
          message: `User cannot remove from assignable with role ${assignee.role}`,
        });
      }

      // EN: Remove the users from the assignable
      // ES: Eliminar los usuarios del asignable
      return removePermissionFromUser({ assignable, userAgent, ctx });
    })
  );
}

module.exports = { removeUserFromAssignable };
