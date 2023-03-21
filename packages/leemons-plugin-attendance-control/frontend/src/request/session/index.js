async function getTemporalSessionsRequest(classId) {
  return leemons.api(`attendance-control/session/temporal/${classId}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { getTemporalSessionsRequest };
