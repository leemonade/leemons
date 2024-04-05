async function save(body) {
  return leemons.api(`v1/board-messages/messages/save`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default save;
