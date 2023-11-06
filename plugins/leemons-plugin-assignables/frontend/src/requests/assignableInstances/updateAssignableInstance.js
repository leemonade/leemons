export default async function updateAssignableInstance({ id, ...data }) {
  const apiData = await leemons.api(`v1/assignables/assignableInstances/${id}`, {
    method: 'PUT',
    body: data,
    allAgents: true,
  });

  return apiData.assignableInstance;
}
