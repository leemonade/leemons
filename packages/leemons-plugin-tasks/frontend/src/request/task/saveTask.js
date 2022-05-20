const pluginPath = 'tasks';

export default async function saveTaskRequest(taskId, task) {
  // EN: If task is not provided, it means that we are creating a new task.
  // ES: Si la tarea no se proporciona, significa que estamos creando una nueva tarea.

  const formData = new FormData();

  formData.append('task', JSON.stringify(task));
  console.log(task.asset.cover);
  throw new Error("I'm not working");

  if (task.asset.cover instanceof File) {
    formData.append('asset.cover', task.asset.cover, task.asset.cover.name);
  } else if (task.asset.cover?.id) {
    formData.append('asset.cover', task.asset.cover.id);
  }

  if (!taskId) {
    // EN: Create a new task
    // ES: Crear una nueva tarea

    const response = await leemons.api(`${pluginPath}/tasks`, {
      allAgents: true,
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'none',
      },
    });

    return response;
  }

  // EN: Update an existing task
  // ES: Actualizar una tarea existente
  const response = await leemons.api(`${pluginPath}/tasks/${taskId}`, {
    allAgents: true,
    method: 'PUT',
    body: formData,
    headers: {
      'content-type': 'none',
    },
  });

  return response;
}
