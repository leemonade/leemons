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

async function getClassSessionsRequest(body) {
  return leemons.api(`attendance-control/class/sessions`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export {
  getTemporalSessionsRequest,
  saveSessionRequest,
  getSessionRequest,
  getClassSessionsRequest,
};
