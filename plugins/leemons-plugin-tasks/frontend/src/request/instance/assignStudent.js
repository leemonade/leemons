export default async function assignStudentRequest(instance, groups) {
  await leemons.api(`tasks/tasks/instances/${instance}/group`, {
    method: 'POST',
    body: {
      groups,
    },
  });

  return true;
}
