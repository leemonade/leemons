export default async function assignStudentRequest(instance, groups) {
  await leemons.api(`v1/tasks/tasks/instances/${instance}/group`, {
    method: 'POST',
    body: {
      groups,
    },
  });

  return true;
}
