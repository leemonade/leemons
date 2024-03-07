async function addView(id) {
  return leemons.api(`v1/board-messages/messages/view`, {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default addView;
