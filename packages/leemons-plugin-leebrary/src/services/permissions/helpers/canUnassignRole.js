const getRolePermissions = require('./getRolePermissions');

module.exports = function canUnassignRole(userRole, assignedUserCurrentRole) {
  const userPermissions = getRolePermissions(userRole);

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
