async function list(body) {
  return leemons.api(`v1/board-messages/messages/list`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default list;
