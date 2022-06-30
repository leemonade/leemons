export default function listStudentTasks(studentId, details = false) {
  return leemons.api(`tasks/tasks/instances/student/${studentId}?details=${details}`);
}
