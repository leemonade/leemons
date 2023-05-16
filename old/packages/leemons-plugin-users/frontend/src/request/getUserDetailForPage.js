async function getUserDetailForPage(user) {
  return leemons.api(`users/user/${user}/detail/page`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getUserDetailForPage;
