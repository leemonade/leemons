async function updateCycle(body) {
  return leemons.api('academic-portfolio/cycle', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { updateCycle };
