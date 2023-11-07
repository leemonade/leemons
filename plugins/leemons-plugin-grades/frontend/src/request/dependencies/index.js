const pluginPath = 'grades';

async function listDependencies({ page, size, center }) {
  return leemons.api(`v1/${pluginPath}/dependency?page=${page}&size=${size}&center=${center}`, {
    allAgents: true,
  });
}

async function addDependency(body) {
  return leemons.api(`v1/${pluginPath}/dependency`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}

async function updateDependency(body) {
  return leemons.api(`v1/${pluginPath}/dependency`, {
    method: 'PUT',
    body,
    allAgents: true,
  });
}

async function deleteDependency(id) {
  return leemons.api(`v1/${pluginPath}/dependency/${id}`, {
    method: 'DELETE',
    allAgents: true,
  });
}

export { listDependencies, addDependency, updateDependency, deleteDependency };
