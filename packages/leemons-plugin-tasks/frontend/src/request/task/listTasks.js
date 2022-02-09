export default async function listTasks(draft = false) {
  const response = await leemons.api(`tasks/tasks/search?draft=${draft}`, {
    allAgents: true,
    method: 'GET',
  });

  return response;
}
