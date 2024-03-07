async function addProgramConfig(body) {
  return leemons.api('v1/curriculum/node-levels', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function updateProgramConfig(body) {
  return leemons.api('v1/curriculum/node-levels', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { addProgramConfig, updateProgramConfig };
