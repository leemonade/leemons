export async function listCourses({ page, size, program }) {
  return leemons.api(`v1/academic-portfolio/courses?page=${page}&size=${size}&program=${program}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

export async function getCourseById(id) {
  return leemons.api(`v1/academic-portfolio/courses/${id}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

export async function updateCourse(body) {
  return leemons.api(`v1/academic-portfolio/courses`, {
    allAgents: true,
    method: 'PUT',
    body,
  });
}
