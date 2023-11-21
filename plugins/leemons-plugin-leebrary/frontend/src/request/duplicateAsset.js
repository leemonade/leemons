async function duplicateAsset(assetId, options) {
  return leemons.api(`v1/leebrary/assets/${assetId}`, {
    allAgents: true,
    body: options,
    method: 'POST',
  });
}

export default duplicateAsset;
