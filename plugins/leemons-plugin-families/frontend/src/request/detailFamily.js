async function detailFamily(id) {
  return leemons.api(`families/detail/${id}`, {
    allAgents: true,
  });
}

export default detailFamily;
