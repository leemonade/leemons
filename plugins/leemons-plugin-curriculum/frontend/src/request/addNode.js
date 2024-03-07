async function addNode(body) {
  return leemons.api('v1/curriculum/node', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addNode;
