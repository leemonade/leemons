const getAssignable = require('./getAssignable');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');
const removePermissionFromUser = require('./permissions/assignable/users/removePermissionFromUser');

module.exports = async function removeUserFromAssignable(
  assignableId,
  userAgents,
  { userSession, transacting } = {}
) {
  let assignable;
  let assignerRole;

  // EN: Check if user has access to the assignable
  // ES: Comprobar si el usuario tiene acceso al asignable
  try {
    assignable = await getAssignable.bind(this)(assignableId, { userSession, transacting });
    assignerRole = (await getUserPermission(assignable, { userSession, transacting })).role;
  } catch (e) {
    e.message = `The assignable ${assignableId} does not exist or you don't have access to it.`;
    throw e;
  }

  // EN: Check if the user has permissions to remove the user from the assignable
  // ES: Comprobar si el usuario tiene permisos para eliminar al usuario del asignable
  const userAgentsInfo = await leemons
    .getPlugin('users')
    .services.users.getUserAgentsInfo(userAgents, { transacting });

  const assignableRoles =
    leemons.plugin.config.constants.assignableRolesObject[assignerRole].canAssign;

  return Promise.all(
    userAgentsInfo.map(async (userAgent) => {
      const assignee = await getUserPermission(assignable, {
        userSession: { userAgents: [userAgent] },
        transacting,
      });

      if (!assignableRoles.includes(assignee.role)) {
        throw new Error(`User cannot remove from assignable user with role ${assignee.role}`);
      }

      // EN: Remove the users from the assignable
      // ES: Eliminar los usuarios del asignable
      return removePermissionFromUser(assignable, userAgent, { transacting });
    })
  );
};
