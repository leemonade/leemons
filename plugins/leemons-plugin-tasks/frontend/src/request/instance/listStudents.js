export default async function listStudents(instance, { page, size }) {
  const students = await leemons.api(
    `v1/tasks/tasks/instances/${instance}/students?page=${page}&size=${size}`,
    {
      method: 'GET',
      allAgents: true,
    }
  );

  return students?.students;
}
