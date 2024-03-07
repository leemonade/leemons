async function addFamily(body) {
  return leemons.api('v1/families/families/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addFamily;
