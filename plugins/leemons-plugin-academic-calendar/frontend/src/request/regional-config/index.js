/* eslint-disable no-param-reassign */

async function listRegionalConfigs(center) {
  return leemons.api(`v1/academic-calendar/regionalConfig/list/${center}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveRegionalConfig(body) {
  return leemons.api(`v1/academic-calendar/regionalConfig/save`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function deleteRegionalConfig(id) {
  return leemons.api(`v1/academic-calendar/regionalConfig/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export { listRegionalConfigs, saveRegionalConfig, deleteRegionalConfig };
