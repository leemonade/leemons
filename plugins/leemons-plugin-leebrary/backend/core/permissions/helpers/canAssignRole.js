const getRolePermissions = require('./getRolePermissions');

/**
 * Determines if a user can assign a new role to another user.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.userRole - The role of the user trying to assign the new role.
 * @param {string} params.assignedUserCurrentRole - The current role of the user to whom the new role is being assigned.
 * @param {string} params.newRole - The new role to be assigned.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {boolean} - Returns true if the user can assign the new role, false otherwise.
 */
function canAssignRole({ userRole, assignedUserCurrentRole, newRole, ctx }) {
  const userPermissions = getRolePermissions({ role: userRole, ctx });

  // EN: Check is the user has the permission to assign the new role
  // ES: Comprobar si el usuario tiene permiso para asignar el nuevo rol
  if (!userPermissions.canAssign.includes(newRole)) {
    return false;
  }

  // EN: Check if the user can assign the role to the assigned user
  // ES: Comprobar si el usuario puede asignar el rol al usuario asignado
  return !(
    assignedUserCurrentRole !== undefined &&
    assignedUserCurrentRole !== newRole &&
    !userPermissions.canUnassign.includes(assignedUserCurrentRole)
  );
}

module.exports = canAssignRole;
