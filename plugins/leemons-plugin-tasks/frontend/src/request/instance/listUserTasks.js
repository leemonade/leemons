export default function listUserTasks(filters) {
  return leemons.api(
    `v1/tasks/tasks/instances/search?${Object.entries(filters)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      method: 'GET',
      allAgents: true,
    }
  );
}
