async function listPermissions() {
  return leemons.api('users/permission/list', { allAgents: true });
}

export default listPermissions;
