async function setPermissions(assetId, userAgentsAndRoles) {
  return leemons.api(`leebrary/asset/${assetId}/permissions`, {
    allAgents: true,
    method: 'POST',
    body: { userAgentsAndRoles },
  });
}

export default setPermissions;
