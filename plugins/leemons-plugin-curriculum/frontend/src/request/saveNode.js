async function saveNode(body) {
  return leemons.api('v1/curriculum/node', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export default saveNode;
