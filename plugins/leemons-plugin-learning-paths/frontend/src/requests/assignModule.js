export default async function assignModuleRequest(id, options) {
  return await leemons.api(`v1/learning-paths/modules/${id}/assign`, {
    method: 'POST',
    body: { ...options },
  });
}
