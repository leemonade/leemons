import _ from 'lodash';

const pluginPath = 'tasks';

export default async function saveTaskRequest(taskId, task) {
  // EN: If task is not provided, it means that we are creating a new task.
  // ES: Si la tarea no se proporciona, significa que estamos creando una nueva tarea.

  const formData = new FormData();

  const cover = task?.asset?.cover;
  const taskData = _.omit(task, ['asset.cover']);

  formData.append('task', JSON.stringify(taskData));

  if (cover instanceof File) {
    formData.append('asset.cover', cover, cover.name);
  } else if (typeof cover === 'string') {
    formData.append('asset.cover', cover);
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
