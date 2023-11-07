export default async function updateStudentRequest({ instance, student, ...data }) {
  const result = await leemons.api(`v1/tasks/assignments/instance/${instance}/student/${student}`, {
    allAgents: true,
    method: 'PUT',
    body: data,
  });

  return result?.updated === true;
}
