export async function listProviders() {
  const { providers } = await leemons.api('v1/users/providers/list');

  return providers;
}

export default listProviders;
