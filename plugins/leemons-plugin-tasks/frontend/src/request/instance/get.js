export default async function getInstanceRequest({ id, columns }) {
  const instance = await leemons.api(`v1/tasks/tasks/instances/${id}?columns=${columns}`, {
    allAgents: true,
    method: 'GET',
  });

  return instance.data;
}
