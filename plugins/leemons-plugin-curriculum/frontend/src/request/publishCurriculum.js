async function publishCurriculum(id) {
  return leemons.api(`v1/curriculum/curriculum/${id}/publish`, {
    allAgents: true,
    method: 'POST',
  });
}

export default publishCurriculum;
