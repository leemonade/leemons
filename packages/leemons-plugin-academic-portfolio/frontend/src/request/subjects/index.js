async function listSubjects({ page, size, program, course }) {
  return leemons.api(
    `academic-portfolio/subject?page=${page}&size=${size}&program=${program}&course=${course}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
}

async function createSubject(body) {
  return leemons.api('academic-portfolio/subject', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateSubject(body) {
  return leemons.api('academic-portfolio/subject', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function updateSubjectCredits(body) {
  return leemons.api('academic-portfolio/subject/credits', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function getSubjectCredits({ program, subject }) {
  return leemons.api(`academic-portfolio/subject/credits?program=${program}&subject=${subject}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listSubjectCreditsForProgram(program) {
  return leemons.api(`academic-portfolio/subject/credits/list?program=${program}`, {
    allAgents: true,
    method: 'GET',
  });
}

export {
  listSubjects,
  createSubject,
  updateSubject,
  updateSubjectCredits,
  getSubjectCredits,
  listSubjectCreditsForProgram,
};
