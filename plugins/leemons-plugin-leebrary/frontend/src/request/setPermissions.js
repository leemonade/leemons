async function setPermissions(assetId, body) {
  return leemons.api(`v1/leebrary/asset/${assetId}/permissions`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default setPermissions;
