const pluginPath = 'grades';

async function listDependencies({ page, size, center }) {
  return leemons.api(`${pluginPath}/dependencies?page=${page}&size=${size}&center=${center}`, {
    allAgents: true,
  });
}

async function addDependency(body) {
  return leemons.api(`${pluginPath}/dependencies`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}

async function updateDependency(body) {
  return leemons.api(`${pluginPath}/dependencies`, {
    method: 'PUT',
    body,
    allAgents: true,
  });
}

async function deleteDependency(id) {
  return leemons.api(`${pluginPath}/dependencies/${id}`, {
    method: 'DELETE',
    allAgents: true,
  });
}

export { listDependencies, addDependency, updateDependency, deleteDependency };
