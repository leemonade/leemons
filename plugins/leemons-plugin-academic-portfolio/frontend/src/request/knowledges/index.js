async function listKnowledges({ page, size, program }) {
  return leemons.api(`academic-portfolio/knowledge?page=${page}&size=${size}&program=${program}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function createKnowledge(body) {
  return leemons.api('academic-portfolio/knowledge', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateKnowledge(body) {
  return leemons.api('academic-portfolio/knowledge', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { listKnowledges, createKnowledge, updateKnowledge };
