async function publishCurriculum(id) {
  return leemons.api(`curriculum/curriculum/${id}/publish`, {
    allAgents: true,
    method: 'POST',
  });
}

export default publishCurriculum;
