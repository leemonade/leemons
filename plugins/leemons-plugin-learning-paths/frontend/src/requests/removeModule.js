export default async function removeModuleRequest(id) {
  return await leemons.api(`v1/learning-paths/modules/${id}`, {
    method: 'DELETE',
  });
}
