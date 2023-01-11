async function duplicateAsset(assetId, options) {
  return leemons.api(`leebrary/assets/${assetId}`, {
    allAgents: true,
    body: options,
    method: 'POST',
  });
}

export default duplicateAsset;
