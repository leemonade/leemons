async function listPermissions() {
  return leemons.api('v1/users/permissions/list', { allAgents: true });
}

export default listPermissions;
