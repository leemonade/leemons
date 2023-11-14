async function listUsers(body) {
  return leemons.api('v1/users/users/list', {
    method: 'POST',
    allAgents: true,
    body,
  });
}

export default listUsers;
