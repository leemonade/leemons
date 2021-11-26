async function addFamily(body) {
  return leemons.api('families/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addFamily;
