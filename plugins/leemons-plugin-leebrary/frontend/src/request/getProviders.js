async function getProviders() {
  return leemons.api(`leebrary/providers`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getProviders;
