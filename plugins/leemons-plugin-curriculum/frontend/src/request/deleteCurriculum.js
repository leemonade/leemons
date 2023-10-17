async function deleteCurriculum(id) {
  return leemons.api(`curriculum/curriculum/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default deleteCurriculum;
