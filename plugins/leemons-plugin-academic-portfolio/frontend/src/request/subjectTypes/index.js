async function listSubjectTypes({ page, size, program }) {
  return leemons.api(
    `v1/academic-portfolio/subjectType?page=${page}&size=${size}&program=${program}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
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

export { listSubjectTypes, createSubjectType, updateSubjectType };
