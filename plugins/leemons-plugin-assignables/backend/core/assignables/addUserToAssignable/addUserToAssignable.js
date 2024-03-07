const { LeemonsError } = require('@leemons/error');

const { assignableRolesObject } = require('../../../config/constants');
const { getAssignable } = require('../getAssignable');
const {
  addPermissionToUser,
} = require('../../permissions/assignables/users/addPermissionToUser');
const {
  getUserPermission,
} = require('../../permissions/assignables/users/getUserPermission');

/**
 * @async
 * @function addUserToAssignable
 * @param {Object} params - Parameters for addUserToAssignable
 * @param {string} params.assignableId - The id of the assignable
 * @param {Array<string>} params.userAgents - The user agents to be added
 * @param {string} params.role - The role of the user
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The result of adding user to assignable
 * @throws {LeemonsError} When the assignable does not exist or the user does not have access to it
 * @throws {LeemonsError} When the user cannot assign to assignable with the given role
 */

async function addUserToAssignable({ assignableId, userAgents, role, ctx }) {
  let assignerRole;

  try {
    // EN: Get the assignable and check the permissions.
    // ES: Obtenemos el asignable y comprobamos los permisos.
    await getAssignable({ id: assignableId, ctx });
    assignerRole = (await getUserPermission({ assignableId, ctx })).role;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `The assignable ${assignableId} does not exist or you don't have access to it.`,
      httpStatusCode: 404,
      cause: e,
    });
  }

  // EN: Get the assignable roles of the assigner.
  // ES: Obtenemos los roles del asignador.
  const assignableRoles = assignableRolesObject[assignerRole].canAssign;

  // EN: Check if the role can be assigned by the assigner.
  // ES: Comprobamos si el rol puede ser asignado por el asignador.
  if (!assignableRoles.includes(role)) {
    throw new LeemonsError(ctx, {
      message: `User cannot assign to assignable with role ${role}`,
    });
  }

  // EN: Add permissions to the user
  // ES: Añadimos permisos al usuario
  return addPermissionToUser({ id: assignableId, userAgents, role, ctx });
}

module.exports = { addUserToAssignable };
