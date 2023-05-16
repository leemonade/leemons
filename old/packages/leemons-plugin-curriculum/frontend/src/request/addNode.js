async function addNode(body) {
  return leemons.api('curriculum/node', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addNode;
