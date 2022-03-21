export default function listTeacherTasks(teacherId, filters) {
  return leemons.api(
    `tasks/tasks/instances/teacher/${teacherId}/search?${Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`
  );
}
