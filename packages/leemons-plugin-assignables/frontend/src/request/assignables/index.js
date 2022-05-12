async function listAssignableInstances({ page, size, class: classe }) {
  return leemons.api(`assignables/instances?page=${page}&size=${size}&class=${classe}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { listAssignableInstances };
