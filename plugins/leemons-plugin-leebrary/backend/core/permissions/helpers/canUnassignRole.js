const getRolePermissions = require('./getRolePermissions');

/**
 * Determines if a user can unassign a role from another user.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.userRole - The role of the user trying to unassign the role.
 * @param {string} params.assignedUserCurrentRole - The current role of the user from whom the role is being unassigned.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {boolean} - Returns true if the user can unassign the role, false otherwise.
 */
function canUnassignRole({ userRole, assignedUserCurrentRole, ctx }) {
  const userPermissions = getRolePermissions({ role: userRole, ctx });

  // EN: Check if the user can delete the role to the assigned user
  // ES: Comprobar si el usuario puede quitar el rol al usuario asignado
  return !(
    assignedUserCurrentRole !== undefined &&
    !userPermissions.canUnassign.includes(assignedUserCurrentRole)
  );
}

module.exports = canUnassignRole;
