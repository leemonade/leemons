async function setPermissions(assetId, body) {
  return leemons.api(`v1/leebrary/permissions/asset/${assetId}`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default setPermissions;
