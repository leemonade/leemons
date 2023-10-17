async function hasPins() {
  return leemons.api(`leebrary/assets/has-pins`, {
    allAgents: true,
    method: 'GET',
  });
}

export default hasPins;
