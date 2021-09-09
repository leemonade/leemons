async function removeFamily(id) {
  return leemons.api(
    {
      url: 'families/remove/:id',
      allAgents: true,
      query: { id },
    },
    {
      method: 'DELETE',
    }
  );
}

export default removeFamily;
