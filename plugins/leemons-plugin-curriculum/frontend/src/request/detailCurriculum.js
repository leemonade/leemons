async function detailCurriculum(id, body = {}) {
  return leemons.api(`v1/curriculum/curriculum/${id}`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default detailCurriculum;
