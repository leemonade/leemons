export default async function searchAssignableInstances() {
  const result = await leemons.api('assignables/assignableInstances', {
    allAgents: true,
    method: 'GET',
  });

  return result.assignableInstances;
}
