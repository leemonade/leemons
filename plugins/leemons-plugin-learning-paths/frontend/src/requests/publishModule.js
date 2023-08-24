export default async function publishModuleRequest(id) {
  const response = await leemons.api(`learning-paths/modules/${id}/publish`, {
    method: 'POST',
  });

  return response;
}
