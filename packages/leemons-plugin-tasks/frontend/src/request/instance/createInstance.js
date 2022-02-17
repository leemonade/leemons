export default function createInstanceRequest(
  taskId,
  { deadline, executionTime, message, startDate, visualizationDate }
) {
  const instance = leemons
    .api(`tasks/tasks/${taskId}/assignments/instance`, {
      method: 'POST',
      body: {
        // Can be a Date object or a string
        startDate,
        deadline,
        visualizationDate,
        // Time in ms, 0 for not limit time
        executionTime,
        message,
      },
    })
    .then(({ instance: i }) => i);

  return instance;
}
