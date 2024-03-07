export default function listStudentTasks(studentId, details = false) {
  return leemons.api(`v1/tasks/tasks/instances/student/${studentId}?details=${details}`);
}
