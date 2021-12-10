async function updateRole(body) {
  return leemons.api('users/roles/update', {
    method: 'POST',
    body,
  });
}

export default updateRole;
