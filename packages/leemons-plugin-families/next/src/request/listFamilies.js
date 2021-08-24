async function listFamilies(body) {
  return leemons.api(
    {
      url: 'families/list',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default listFamilies;
