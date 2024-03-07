async function updateRole(body) {
  return leemons.api('v1/users/roles/update', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateRole;
