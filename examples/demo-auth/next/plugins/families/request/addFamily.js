async function addFamily(body) {
  return leemons.api(
    {
      url: 'families/add',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default addFamily;
