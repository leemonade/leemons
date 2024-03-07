async function removeFamily(id) {
  return leemons.api(`v1/families/families/remove/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default removeFamily;
