async function duplicateAsset(assetId) {
  return leemons.api(`leebrary/assets/${assetId}`, {
    allAgents: true,
    method: 'POST',
  });
}

export default duplicateAsset;
