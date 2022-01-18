async function getPermissionsWithActionsIfIHave(permissionNames) {
  return leemons.api('users/permission/get-if-have', {
    allAgents: true,
    method: 'POST',
    body: { permissionNames },
  });
}

export default getPermissionsWithActionsIfIHave;
