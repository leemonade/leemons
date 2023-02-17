async function getOverlaps(body) {
  return leemons.api(`board-messages/overlaps`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default getOverlaps;
