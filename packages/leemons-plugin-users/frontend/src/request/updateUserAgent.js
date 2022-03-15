async function updateUserAgent(userAgent, body) {
  return leemons.api(`users/user-agent/${userAgent}/update`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateUserAgent;
