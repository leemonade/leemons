async function listRoles(body) {
  return leemons.api('users/roles/list', {
    method: 'POST',
    body,
  });
}

export default listRoles;
