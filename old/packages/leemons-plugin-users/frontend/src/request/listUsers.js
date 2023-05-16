async function listUsers(body) {
  return leemons.api('users/user/list', {
    method: 'POST',
    allAgents: true,
    body,
  });
}

export default listUsers;
