async function listKnowledgeAreas({ page, size, center }) {
  const queryParams = new URLSearchParams({ page, size, center }).toString();

  return leemons.api(`v1/academic-portfolio/knowledges?${queryParams}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function createKnowledgeArea(body) {
  return leemons.api('v1/academic-portfolio/knowledges', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateKnowledgeArea(body) {
  return leemons.api('v1/academic-portfolio/knowledges', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function deleteKnowledgeArea({ knowledgeAreaId, soft }) {
  const queryParams = new URLSearchParams();
  if (soft) queryParams.append('soft', 'true');

  return leemons.api(`v1/academic-portfolio/knowledges/${knowledgeAreaId}?${queryParams}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function getKnowledgeArea(knowledgeAreaId) {
  return leemons.api(`v1/academic-portfolio/knowledges/${knowledgeAreaId}`, {
    allAgents: true,
    method: 'GET',
  });
}
export {
  listKnowledgeAreas,
  createKnowledgeArea,
  updateKnowledgeArea,
  deleteKnowledgeArea,
  createKnowledgeArea as createKnowledge,
  updateKnowledgeArea as updateKnowledge,
  getKnowledgeArea,
};
