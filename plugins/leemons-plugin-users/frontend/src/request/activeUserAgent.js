async function activeUserAgent(id) {
  return leemons.api('v1/users/users/user-agents/active', {
    allAgents: true,
    method: 'POST',
    body: {
      userAgent: id,
    },
  });
}

export default activeUserAgent;
