export default async function duplicateModuleRequest(id, { published = false } = {}) {
  const duplicatedModule = await leemons.api(
    `v1/learning-paths/modules/${id}/duplicate?published=${!!published}`,
    {
      method: 'POST',
    }
  );

  return duplicatedModule?.module;
}
