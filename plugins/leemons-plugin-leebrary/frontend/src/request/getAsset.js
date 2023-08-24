async function getAsset(assetId) {
  return leemons.api(`leebrary/assets/${assetId}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAsset;
