async function unpinAsset(assetId) {
  return leemons.api(`v1/leebrary/assets/pins/${assetId}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default unpinAsset;
