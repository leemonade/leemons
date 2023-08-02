const getRolePermissions = require('./getRolePermissions');

module.exports = function canUnassignRole({ userRole, assignedUserCurrentRole, ctx }) {
  const userPermissions = getRolePermissions({ role: userRole, ctx });

  // EN: Check if the user can delete the role to the assigned user
  // ES: Comprobar si el usuario puede quitar el rol al usuario asignado
  if (
    assignedUserCurrentRole !== undefined &&
    !userPermissions.canUnassign.includes(assignedUserCurrentRole)
  ) {
    return false;
  }

  return true;
};
