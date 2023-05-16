async function listDetailPage(user) {
  return leemons.api(`families/list/detail/page/${user}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default listDetailPage;
