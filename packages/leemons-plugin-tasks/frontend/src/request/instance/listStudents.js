export default async function listStudents(instance, { page, size }) {
  const students = await leemons.api(
    `tasks/tasks/instances/${instance}/students?page=${page}&size=${size}`,
    {
      method: 'GET',
      allAgents: true,
    }
  );

  return students?.students;
}
