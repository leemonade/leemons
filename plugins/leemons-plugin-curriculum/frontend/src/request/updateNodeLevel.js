async function updateNodeLevel(body) {
  return leemons.api('v1/curriculum/node-levels', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export default updateNodeLevel;
