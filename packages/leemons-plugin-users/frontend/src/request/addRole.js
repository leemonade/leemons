async function addRole(body) {
  return leemons.api('users/roles/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addRole;
