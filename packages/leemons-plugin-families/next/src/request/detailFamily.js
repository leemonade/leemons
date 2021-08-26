async function detailFamily(id) {
  return leemons.api({
    url: 'families/detail/:id',
    allAgents: true,
    query: { id },
  });
}

export default detailFamily;
