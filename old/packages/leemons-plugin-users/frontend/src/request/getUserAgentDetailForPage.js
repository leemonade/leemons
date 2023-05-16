async function getUserAgentDetailForPage(userAgent) {
  return leemons.api(`users/user-agent/${userAgent}/detail/page`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getUserAgentDetailForPage;
