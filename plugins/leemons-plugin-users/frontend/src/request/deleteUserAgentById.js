async function deleteUserAgentById(id) {
  return leemons.api(`v1/users/users/user-agent/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default deleteUserAgentById;
