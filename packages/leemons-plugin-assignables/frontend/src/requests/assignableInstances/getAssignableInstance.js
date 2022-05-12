export default async function getAssignableInstance({ id, details = true }) {
  const apiData = await leemons.api(`assignables/assignableInstances/${id}?details=${details}`, {
    method: 'GET',
    allAgents: true,
  });

  console.log(apiData);

  return apiData.assignableInstance;
}
