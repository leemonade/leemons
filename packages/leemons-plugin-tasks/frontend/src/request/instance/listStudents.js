export default async function listStudents(instance) {
  const students = await leemons.api(`tasks/tasks/instances/${instance}/students`, {
    method: 'GET',
    allAgents: true,
  });

  return students?.students;
}
