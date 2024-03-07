export default async function publishModuleRequest(id) {
  return await leemons.api(`v1/learning-paths/modules/${id}/publish`, {
    method: 'POST',
  });
}
