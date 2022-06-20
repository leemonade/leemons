async function getConfig(programId) {
  return leemons.api(`academic-calendar/config/${programId}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveConfig(body) {
  return leemons.api(`academic-calendar/config`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export { getConfig, saveConfig };
