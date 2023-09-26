const getRolePermissions = require('./getRolePermissions');

module.exports = function canAssignRole({ userRole, assignedUserCurrentRole, newRole, ctx }) {
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
};
