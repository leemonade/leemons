async function getActive(body) {
  return leemons.api(`v1/board-messages/messages/active`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default getActive;
