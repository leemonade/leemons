async function disableUserAgent(id) {
  return leemons.api('v1/users/users/user-agents/disable', {
    allAgents: true,
    method: 'POST',
    body: {
      userAgent: id,
    },
  });
}

export default disableUserAgent;
