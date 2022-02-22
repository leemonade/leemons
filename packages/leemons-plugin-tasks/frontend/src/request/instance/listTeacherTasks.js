export default function listTeacherTasks(teacherId) {
  return leemons.api(`tasks/tasks/instances/teacher/${teacherId}`);
}
