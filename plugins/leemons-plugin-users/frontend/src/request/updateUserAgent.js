async function updateUserAgent(userAgent, body) {
  return leemons.api(`v1/users/users/user-agent/${userAgent}/update`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateUserAgent;
