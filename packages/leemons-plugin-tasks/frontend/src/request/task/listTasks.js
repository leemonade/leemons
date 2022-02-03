export default async function listTasks() {
  const response = await leemons.api('/tasks/tasks/search', {
    allAgents: true,
    method: 'GET',
  });

  return response;
}
