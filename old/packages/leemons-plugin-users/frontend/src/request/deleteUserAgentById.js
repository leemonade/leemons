async function deleteUserAgentById(id) {
  return leemons.api(`users/user-agent/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default deleteUserAgentById;
