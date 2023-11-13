async function getUserAgentDetailForPage(userAgent) {
  return leemons.api(`v1/users/users/user-agent/${userAgent}/detail/page`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getUserAgentDetailForPage;
