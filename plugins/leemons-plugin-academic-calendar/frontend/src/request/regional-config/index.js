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

export { listRegionalConfigs, saveRegionalConfig };
