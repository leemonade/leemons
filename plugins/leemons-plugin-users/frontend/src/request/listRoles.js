async function listRoles(body) {
  return leemons.api('v1/users/roles/list', {
    method: 'POST',
    body,
  });
}

export default listRoles;
