async function hasPins() {
  return leemons.api(`v1/leebrary/assets/has-pins`, {
    allAgents: true,
    method: 'GET',
  });
}

export default hasPins;
