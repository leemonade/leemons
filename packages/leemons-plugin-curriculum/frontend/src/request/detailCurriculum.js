async function detailCurriculum(id, body = {}) {
  return leemons.api(`curriculum/curriculum/${id}`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default detailCurriculum;
