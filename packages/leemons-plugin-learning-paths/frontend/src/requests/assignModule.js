export default async function assignModuleRequest(id, options) {
  const response = await leemons.api(`learning-paths/modules/${id}/assign`, {
    method: 'POST',
    body: { ...options },
  });

  return response;
}
