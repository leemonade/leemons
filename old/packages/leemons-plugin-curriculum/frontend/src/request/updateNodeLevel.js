async function updateNodeLevel(body) {
  return leemons.api('curriculum/node-levels', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export default updateNodeLevel;
