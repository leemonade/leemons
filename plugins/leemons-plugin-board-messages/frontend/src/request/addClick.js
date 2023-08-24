async function addClick(id) {
  return leemons.api(`board-messages/click`, {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default addClick;
