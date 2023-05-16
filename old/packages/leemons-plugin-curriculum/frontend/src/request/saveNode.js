async function saveNode(body) {
  return leemons.api('curriculum/node', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export default saveNode;
