export function updateStatus({ instance, user, state }) {
  return leemons.api(`v1/scorm/status/${instance}/${user}`, {
    allAgents: true,
    method: 'PUT',
    body: {
      state,
    },
  });
}

export function getScormAssignation({ instance, user }) {
  return leemons.api(`v1/scorm/assignation/${instance}/${user}`, {
    allAgents: true,
    method: 'GET',
  });
}
