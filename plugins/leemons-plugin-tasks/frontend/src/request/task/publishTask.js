const pluginPath = 'tasks';

export default async function publishTaskRequest(taskId) {
  // EN: Publish the task
  // ES: Publicar la tarea
  await leemons.api(`${pluginPath}/tasks/${taskId}/publish`, {
    allAgents: true,
    method: 'POST',
  });

  return true;
}
