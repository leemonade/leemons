export default async function createModuleRequest(module, { published = false } = {}) {
  const createdModule = await leemons.api('v1/learning-paths/modules', {
    method: 'POST',
    body: {
      ...module,
      published: !!published,
    },
  });

  return createdModule?.module;
}
