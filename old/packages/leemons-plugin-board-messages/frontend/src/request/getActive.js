async function getActive(body) {
  return leemons.api(`board-messages/active`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default getActive;
