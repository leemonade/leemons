async function updateFamily(body) {
  return leemons.api(
    {
      url: 'families/update',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default updateFamily;
