async function getProviders() {
  return leemons.api(`v1/leebrary/providers`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getProviders;
