async function listFamilies(body) {
  return leemons.api('families/list', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listFamilies;
