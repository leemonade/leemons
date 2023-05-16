const getAssignable = require('./getAssignable');
const addPermissionToUser = require('./permissions/assignable/users/addPermissionToUser');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');

module.exports = async function addUserToAssignable(
  assignableId,
  userAgents,
  role,
  { userSession, transacting } = {}
) {
  let assignable;
  let assignerRole;

  try {
    // EN: Get the assignable and check the permissions.
    // ES: Obtenemos el asignable y comprobamos los permisos.
    assignable = await getAssignable.bind(this)(assignableId, { userSession, transacting });
    assignerRole = (await getUserPermission(assignable, { userSession, transacting })).role;
  } catch (e) {
    e.message = `The assignable ${assignableId} does not exist or you don't have access to it.`;

    throw e;
  }

  // EN: Get the assignable roles of the assigner.
  // ES: Obtenemos los roles del asignador.
  const assignableRoles =
    leemons.plugin.config.constants.assignableRolesObject[assignerRole].canAssign;

  // EN: Check if the role can be assigned by the assigner.
  // ES: Comprobamos si el rol puede ser asignado por el asignador.
  if (!assignableRoles.includes(role)) {
    throw new Error(`User cannot assign to assignable with role ${role}`);
  }

  // EN: Add permissions to the user
  // ES: Añadimos permisos al usuario
  return addPermissionToUser(assignable, userAgents, role, { userSession, transacting });
};
