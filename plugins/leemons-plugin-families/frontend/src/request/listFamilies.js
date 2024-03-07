async function listFamilies(body) {
  return leemons.api('v1/families/families/list', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listFamilies;
