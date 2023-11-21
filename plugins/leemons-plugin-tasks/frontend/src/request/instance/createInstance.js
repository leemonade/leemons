export default function createInstanceRequest(taskId, body) {
  return leemons
    .api(`v1/tasks/assignments/${taskId}/instance`, {
      method: 'POST',
      body,
    })
    .then(({ instance: i }) => i);
}
