async function deleteAsset(assetId) {
  return leemons.api(`leebrary/assets/${assetId}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default deleteAsset;
