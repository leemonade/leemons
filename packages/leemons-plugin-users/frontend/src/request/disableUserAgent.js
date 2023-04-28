async function disableUserAgent(id) {
  return leemons.api('users/user-agents/disable', {
    method: 'POST',
    body: {
      userAgent: id,
    },
  });
}

export default disableUserAgent;
