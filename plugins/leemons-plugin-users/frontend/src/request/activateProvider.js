export async function activateProvider(provider) {
  await leemons.api('v1/users/providers', {
    method: 'POST',
    body: { provider },
  });
}

export default activateProvider;
