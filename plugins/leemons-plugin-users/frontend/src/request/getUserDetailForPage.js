async function getUserDetailForPage(user) {
  return leemons.api(`v1/users/users/${user}/detail/page`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getUserDetailForPage;
