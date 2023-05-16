export default async function assignTeacherRequest(instance, teacher) {
  await leemons.api(`tasks/tasks/instances/${instance}/teacher`, {
    method: 'POST',
    body: {
      teacher,
    },
  });

  return true;
}
