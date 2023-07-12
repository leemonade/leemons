async function activeUserAgent(id) {
  return leemons.api('users/user-agents/active', {
    allAgents: true,
    method: 'POST',
    body: {
      userAgent: id,
    },
  });
}

export default activeUserAgent;
