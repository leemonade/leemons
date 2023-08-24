async function addCurriculum(body) {
  return leemons.api('curriculum/curriculum', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addCurriculum;
