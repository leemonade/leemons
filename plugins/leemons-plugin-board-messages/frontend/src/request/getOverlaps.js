async function getOverlaps(body) {
  return leemons.api(`v1/board-messages/messages/overlaps`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default getOverlaps;
