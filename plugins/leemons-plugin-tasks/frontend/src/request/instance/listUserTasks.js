export default function listUserTasks(filters) {
  return leemons.api(
    `tasks/tasks/instances/search?${Object.entries(filters)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      method: 'GET',
      allAgents: true,
    }
  );
}
