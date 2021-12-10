async function removeFile(id) {
  return leemons.api(`media-library/remove/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default removeFile;
