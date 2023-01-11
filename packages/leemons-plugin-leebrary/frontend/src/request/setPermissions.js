async function setPermissions(assetId, { canAccess, classesCanAccess, isPublic } = {}) {
  return leemons.api(`leebrary/asset/${assetId}/permissions`, {
    allAgents: true,
    method: 'POST',
    body: { canAccess, classesCanAccess, isPublic },
  });
}

export default setPermissions;
