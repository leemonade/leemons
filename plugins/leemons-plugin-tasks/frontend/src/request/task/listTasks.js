export default async function listTasks(query) {
  const response = await leemons.api(
    `tasks/tasks/search?${Object.entries(query)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );

  return response;
}
