async function getAssetsByIds(assets) {
  return leemons.api(`leebrary/assets/list`, {
    allAgents: true,
    body: {
      assets,
    },
    method: 'POST',
  });
}

export default getAssetsByIds;
