export default function listTeacherTasks(teacherId, filters) {
  return leemons.api(
    `tasks/tasks/instances/teacher/${teacherId}/search?${Object.entries(filters)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`
  );
}
