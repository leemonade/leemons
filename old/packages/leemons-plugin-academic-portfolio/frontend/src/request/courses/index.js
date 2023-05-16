export async function listCourses({ page, size, program }) {
  return leemons.api(`academic-portfolio/course?page=${page}&size=${size}&program=${program}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

export async function updateCourse(body) {
  return leemons.api(`academic-portfolio/course`, {
    allAgents: true,
    method: 'PUT',
    body,
  });
}
