export default async function removeModuleRequest(id) {
  const response = await leemons.api(`learning-paths/modules/${id}`, {
    method: 'DELETE',
  });

  return response;
}
