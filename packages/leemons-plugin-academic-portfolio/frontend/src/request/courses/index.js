export async function listCourses({ page, size, program }) {
  return leemons.api(`academic-portfolio/course?page=${page}&size=${size}&program=${program}`, {
    allAgents: true,
    method: 'GET',
  });
}
