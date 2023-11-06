async function listKnowledges({ page, size, program }) {
  return leemons.api(
    `v1/academic-portfolio/knowledges?page=${page}&size=${size}&program=${program}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
}

async function createKnowledge(body) {
  return leemons.api('v1/academic-portfolio/knowledges', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateKnowledge(body) {
  return leemons.api('v1/academic-portfolio/knowledges', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { listKnowledges, createKnowledge, updateKnowledge };
