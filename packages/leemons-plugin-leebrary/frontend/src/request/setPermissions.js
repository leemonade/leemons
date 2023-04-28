async function setPermissions(assetId, body) {
  return leemons.api(`leebrary/asset/${assetId}/permissions`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default setPermissions;
