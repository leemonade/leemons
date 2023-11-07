async function addRole(body) {
  return leemons.api('v1/users/roles/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addRole;
