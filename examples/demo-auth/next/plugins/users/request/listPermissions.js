async function listPermissions() {
  return leemons.api({
    url: 'users/permission/list',
    allAgents: true,
  });
}

export default listPermissions;
