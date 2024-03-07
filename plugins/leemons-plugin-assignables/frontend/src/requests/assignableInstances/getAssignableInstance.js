export default async function getAssignableInstance({ id, details = true }) {
  const apiData = await leemons.api(`v1/assignables/assignableInstances/${id}?details=${details}`, {
    method: 'GET',
    allAgents: true,
  });

  return apiData.assignableInstance;
}
