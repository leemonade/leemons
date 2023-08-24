async function addView(id) {
  return leemons.api(`board-messages/view`, {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default addView;
