const getRolePermissions = require('./getRolePermissions');

module.exports = function canAssignRole(userRole, assignedUserCurrentRole, newRole) {
  const userPermissions = getRolePermissions(userRole);

  // EN: Check is the user has the permission to assign the new role
  // ES: Comprobar si el usuario tiene permiso para asignar el nuevo rol
  if (!userPermissions.canAssign.includes(newRole)) {
    return false;
  }

  // EN: Check if the user can assign the role to the assigned user
  // ES: Comprobar si el usuario puede asignar el rol al usuario asignado
  if (
    assignedUserCurrentRole !== undefined &&
    assignedUserCurrentRole !== newRole &&
    !userPermissions.canUnassign.includes(assignedUserCurrentRole)
  ) {
    return false;
  }

  return true;
};
