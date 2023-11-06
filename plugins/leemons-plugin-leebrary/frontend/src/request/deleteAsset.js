async function deleteAsset(assetId) {
  return leemons.api(`v1/leebrary/assets/${assetId}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default deleteAsset;
