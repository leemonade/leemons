export default function updateInstanceRequest(
  instanceId,
  {
    deadline,
    executionTime,
    message,
    startDate,
    visualizationDate,
    alwaysOpen,
    closeDate,
    showCurriculum,
  }
) {
  const instance = leemons
    .api(`tasks/tasks/assignments/instance/${instanceId}`, {
      method: 'PUT',
      body: {
        // Can be a Date object or a string
        startDate,
        deadline,
        visualizationDate,
        // Time in ms, 0 for not limit time
        executionTime,
        alwaysOpen,
        closeDate,
        message,
        showCurriculum,
      },
    })
    .then(({ instance: i }) => i);

  return instance;
}
