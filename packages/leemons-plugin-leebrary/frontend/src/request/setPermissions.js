async function setPermissions(assetId, { canAccess, isPublic } = {}) {
  return leemons.api(`leebrary/asset/${assetId}/permissions`, {
    allAgents: true,
    method: 'POST',
    body: { canAccess, isPublic },
  });
}

export default setPermissions;
