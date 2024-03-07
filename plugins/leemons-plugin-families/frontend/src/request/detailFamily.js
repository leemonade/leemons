async function detailFamily(id) {
  return leemons.api(`v1/families/families/detail/${id}`, {
    allAgents: true,
  });
}

export default detailFamily;
