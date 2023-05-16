async function unpinAsset(assetId) {
  return leemons.api(`leebrary/assets/pins/${assetId}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default unpinAsset;
