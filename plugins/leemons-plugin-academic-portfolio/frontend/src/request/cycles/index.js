async function updateCycle(body) {
  return leemons.api('v1/academic-portfolio/cycle', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { updateCycle };
