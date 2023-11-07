async function getAsset(assetId) {
  return leemons.api(`v1/leebrary/assets/${assetId}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAsset;
