async function listSubjectTypes({ page, size, center }) {
  const queryParams = new URLSearchParams({ page, size, center }).toString();

  return leemons.api(`v1/academic-portfolio/subjectType?${queryParams}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function createSubjectType(body) {
  return leemons.api('v1/academic-portfolio/subjectType', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateSubjectType(body) {
  return leemons.api('v1/academic-portfolio/subjectType', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function deleteSubjectType({ subjectTypeId, soft }) {
  const queryParams = new URLSearchParams();
  if (soft) queryParams.append('soft', 'true');

  return leemons.api(`v1/academic-portfolio/subjectType/${subjectTypeId}?${queryParams}`, {
    allAgents: true,
    method: 'DELETE',
  });
}
export { listSubjectTypes, createSubjectType, updateSubjectType, deleteSubjectType };
