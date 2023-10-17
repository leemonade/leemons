const pluginPath = 'tasks';

export default async function getTaskRequest({ id: taskId, columns = '*' }) {
  // EN: Get the current task
  // ES: Obtener la tarea actual
  const response = await leemons.api(`${pluginPath}/tasks/${taskId}?columns=${columns}`, {
    allAgents: true,
    method: 'GET',
  });

  return response?.task;
}
