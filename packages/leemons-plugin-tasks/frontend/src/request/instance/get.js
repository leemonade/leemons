export default async function getInstanceRequest(id) {
  const instance = await leemons.api(`tasks/tasks/instances/${id}`, {
    allAgents: true,
    method: 'GET',
  });

  return instance.data[0];
}
