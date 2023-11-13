async function addCurriculum(body) {
  return leemons.api('v1/curriculum/curriculum', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addCurriculum;
