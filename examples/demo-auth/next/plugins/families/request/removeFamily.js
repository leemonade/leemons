async function removeFamily(id) {
  return leemons.api(`families/remove/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default removeFamily;
