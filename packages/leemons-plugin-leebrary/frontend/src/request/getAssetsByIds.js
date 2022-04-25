async function getAssetsByIds(assets, filters = {}) {
  return leemons.api(`leebrary/assets/list`, {
    allAgents: true,
    body: {
      assets,
      filters,
    },
    method: 'POST',
  });
}

export default getAssetsByIds;
