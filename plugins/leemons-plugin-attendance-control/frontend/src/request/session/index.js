async function getTemporalSessionsRequest(classId) {
  return leemons.api(`v1/attendance-control/session/temporal/${classId}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveSessionRequest(body) {
  return leemons.api(`v1/attendance-control/session/save`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getSessionRequest(id) {
  return leemons.api(`v1/attendance-control/session/detail/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getClassSessionsRequest(body) {
  return leemons.api(`v1/attendance-control/session/class/sessions`, {
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
