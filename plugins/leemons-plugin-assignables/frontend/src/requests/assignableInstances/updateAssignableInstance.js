export default async function updateAssignableInstance({ id, ...data }) {
  const apiData = await leemons.api(`assignables/assignableInstances/${id}`, {
    method: 'PUT',
    body: data,
    allAgents: true,
  });

  return apiData.assignableInstance;
}
