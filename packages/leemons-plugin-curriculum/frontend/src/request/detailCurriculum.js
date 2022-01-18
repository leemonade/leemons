async function detailCurriculum(id) {
  return leemons.api(`curriculum/curriculum/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default detailCurriculum;
