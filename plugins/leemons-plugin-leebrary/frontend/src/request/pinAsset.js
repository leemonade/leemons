async function pinAsset(assetId) {
  return leemons.api(`leebrary/assets/pins`, {
    allAgents: true,
    method: 'POST',
    body: { asset: assetId },
  });
}

export default pinAsset;
