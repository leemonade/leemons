async function activeUserAgent(id) {
  return leemons.api('users/user-agents/active', {
    method: 'POST',
    body: {
      userAgent: id,
    },
  });
}

export default activeUserAgent;
