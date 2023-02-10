async function save(body) {
  return leemons.api(`board-messages/save`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default save;
