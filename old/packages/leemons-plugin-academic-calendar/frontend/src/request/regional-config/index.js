/* eslint-disable no-param-reassign */

async function listRegionalConfigs(center) {
  return leemons.api(`academic-calendar/regional-config/list/${center}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveRegionalConfig(body) {
  return leemons.api(`academic-calendar/regional-config/save`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export { listRegionalConfigs, saveRegionalConfig };
