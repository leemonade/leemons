export default async function updateStudentRequest({ instance, student, key, value }) {
  const result = await leemons.api(
    `tasks/tasks/instances/${instance}/students/${student}/key/${key}/value/${value}`,
    {
      allAgents: true,
      method: 'PUT',
    }
  );

  return result?.updated === true;
}
