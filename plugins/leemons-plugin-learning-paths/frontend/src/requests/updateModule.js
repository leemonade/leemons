export default async function updateModuleRequest(id, newModule, { published = false } = {}) {
  const updatedModule = await leemons.api(`v1/learning-paths/modules/${id}`, {
    method: 'PUT',
    body: { ...newModule, published: !!published },
  });

  return updatedModule?.module;
}
