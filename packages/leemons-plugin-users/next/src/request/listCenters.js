async function listCenters(body) {
  return leemons.api(
    {
      url: 'users/centers',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default listCenters;
