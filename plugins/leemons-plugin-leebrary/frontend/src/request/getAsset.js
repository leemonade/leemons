async function getAsset(assetId, showPublic) {
  const showPublicQuery = typeof showPublic === 'boolean' ? `?showPublic=${showPublic}` : '';
  return leemons.api(`v1/leebrary/assets/${assetId}${showPublicQuery}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAsset;
