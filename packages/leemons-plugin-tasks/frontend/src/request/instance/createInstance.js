export default function createInstanceRequest(
  taskId,
  { deadline, available, executionTime, message }
) {
  const instance = leemons
    .api(`tasks/tasks/${taskId}/assignments/instance`, {
      method: 'POST',
      body: {
        // Can be a Date object or a string
        deadline,
        available,
        // Time in ms, 0 for not limit time
        executionTime,
        message,
      },
    })
    .then(({ instance: i }) => i);

  return instance;
}
