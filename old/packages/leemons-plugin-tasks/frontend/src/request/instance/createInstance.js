export default function createInstanceRequest(taskId, body) {
  const instance = leemons
    .api(`tasks/tasks/${taskId}/assignments/instance`, {
      method: 'POST',
      body,
    })
    .then(({ instance: i }) => i);

  return instance;
}
