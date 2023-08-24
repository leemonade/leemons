async function searchUserAgents(filters, options) {
  return leemons.api('users/user-agents/search', {
    waitToFinish: true,
    method: 'POST',
    allAgents: true,
    body: {
      filters,
      options,
    },
  });
}

export default searchUserAgents;
