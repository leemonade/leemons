async function addClick(id) {
  return leemons.api(`v1/board-messages/messages/click`, {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default addClick;
