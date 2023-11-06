async function removeFile(id) {
  return leemons.api(`v1/leebrary/remove/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default removeFile;
