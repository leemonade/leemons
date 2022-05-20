export default async function updateStudentRequest({ instance, student, ...data }) {
  const result = await leemons.api(`tasks/tasks/instances/${instance}/students/${student}`, {
    allAgents: true,
    method: 'PUT',
    body: data,
  });

  return result?.updated === true;
}
