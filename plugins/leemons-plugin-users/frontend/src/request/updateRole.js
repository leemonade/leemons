async function updateRole(body) {
  return leemons.api('users/roles/update', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateRole;
