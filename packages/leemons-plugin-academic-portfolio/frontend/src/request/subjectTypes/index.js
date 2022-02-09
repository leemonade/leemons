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

export { listSubjectTypes, createSubjectType };
