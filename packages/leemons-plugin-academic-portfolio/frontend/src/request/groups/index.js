async function createGroup(body) {
  return leemons.api('academic-portfolio/group', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateGroup(body) {
  return leemons.api('academic-portfolio/group', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { createGroup, updateGroup };
