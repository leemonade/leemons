async function list(page, size, filters) {
  return leemons.api(`board-messages/list?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'POST',
    body: {
      filters,
    },
  });
}

export default list;
