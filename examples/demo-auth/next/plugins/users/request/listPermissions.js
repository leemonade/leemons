async function listPermissions() {
  return leemons.api('users/permission/list');
}

export default listPermissions;
