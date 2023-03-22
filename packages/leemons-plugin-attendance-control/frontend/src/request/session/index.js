async function getTemporalSessionsRequest(classId) {
  return leemons.api(`attendance-control/session/temporal/${classId}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveSessionRequest(body) {
  return leemons.api(`attendance-control/session/save`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getSessionRequest(id) {
  return leemons.api(`attendance-control/session/detail/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { getTemporalSessionsRequest, saveSessionRequest, getSessionRequest };
