export default async function duplicateModuleRequest(id, { published = false } = {}) {
  const duplicatedModule = await leemons.api(
    `learning-paths/modules/${id}/duplicate?published=${!!published}`,
    {
      method: 'POST',
    }
  );

  return duplicatedModule?.module;
}
