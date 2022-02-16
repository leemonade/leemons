export default async function assignStudentRequest(instance, students) {
  await leemons.api(`tasks/tasks/instances/${instance}/student`, {
    method: 'POST',
    body: {
      student: students,
    },
  });

  return true;
}
