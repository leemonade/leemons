async function pinAsset(assetId) {
  return leemons.api(`v1/leebrary/assets/pins`, {
    allAgents: true,
    method: 'POST',
    body: { asset: assetId },
  });
}

export default pinAsset;
