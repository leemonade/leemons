async function listSubjectTypes({ page, size, program }) {
  return leemons.api(
    `academic-portfolio/subject-type?page=${page}&size=${size}&program=${program}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
}

async function createSubjectType(body) {
  return leemons.api('academic-portfolio/subject-type', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateSubjectType(body) {
  return leemons.api('academic-portfolio/subject-type', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { listSubjectTypes, createSubjectType, updateSubjectType };
