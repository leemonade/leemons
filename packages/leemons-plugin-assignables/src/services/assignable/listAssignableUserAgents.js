const getAssignable = require('./getAssignable');
const getPermissionName = require('./permissions/assignable/getPermissionName');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');
const permission = require('./permissions/permission');

module.exports = async function listAssignableUserAgents(
  assignableId,
  { userSession, transacting } = {}
) {
  const assignable = await getAssignable.call(this, assignableId, { userSession, transacting });

  // TODO: Check if the userSession has permission to list users :D
  // EN: Get the userAgents related with the assignable.
  // ES: Obtenemos los userAgents relacionados con el asignable.
  let users = await permission.findUserAgentsWithPermission(
    { permissionName: getPermissionName(assignable) },
    { transacting }
  );

  // EN: Get the userAgents info.
  // ES: Obtenemos la información del userAgent.
  users = await leemons.getPlugin('users').services.users.getUserAgentsInfo(users, { transacting });

  // EN: Get the userAgents permissions.
  // ES: Obtenemos los permisos del userAgent.
  return Promise.all(
    users.map(async (user) => ({
      userAgent: user.id,
      ...(await getUserPermission(assignable, {
        userSession: { userAgents: [user] },
        transacting,
      })),
    }))
  );
};
