export async function getProvider() {
  const { provider } = await leemons.api('v1/users/providers');

  return provider;
}

export default getProvider;
