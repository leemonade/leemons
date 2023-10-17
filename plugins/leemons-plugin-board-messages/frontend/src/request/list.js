async function list(body) {
  return leemons.api(`board-messages/list`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default list;
