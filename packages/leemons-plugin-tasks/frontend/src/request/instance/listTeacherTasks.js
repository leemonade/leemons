export default function listTeacherTasks(teacherId, details = false) {
  return leemons.api(`tasks/tasks/instances/teacher/${teacherId}?details=${details}`);
}
