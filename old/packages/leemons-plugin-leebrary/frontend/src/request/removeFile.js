async function removeFile(id) {
  return leemons.api(`leebrary/remove/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default removeFile;
