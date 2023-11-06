async function listDetailPage(user) {
  return leemons.api(`v1/families/families/list/detail/page/${user}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default listDetailPage;
