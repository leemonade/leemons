const pluginPath = 'tasks';

export default async function saveTaskRequest(taskId, task) {
  // EN: If task is not provided, it means that we are creating a new task.
  // ES: Si la tarea no se proporciona, significa que estamos creando una nueva tarea.
  if (!taskId) {
    // EN: Create a new task
    // ES: Crear una nueva tarea
    const response = await leemons.api(`${pluginPath}/tasks`, {
      allAgents: true,
      method: 'POST',
      body: task,
    });

    return response;
  }

  // EN: Update an existing task
  // ES: Actualizar una tarea existente
  const response = await leemons.api(`${pluginPath}/tasks/${taskId}`, {
    allAgents: true,
    method: 'PUT',
    body: task,
  });

  return response;
}
