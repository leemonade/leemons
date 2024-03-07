async function deleteCurriculum(id) {
  return leemons.api(`v1/curriculum/curriculum/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default deleteCurriculum;
