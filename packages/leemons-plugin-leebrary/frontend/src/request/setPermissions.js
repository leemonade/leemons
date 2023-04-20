async function setPermissions(
  assetId,
  { canAccess, programsCanAccess, permissions, classesCanAccess, isPublic } = {}
) {
  return leemons.api(`leebrary/asset/${assetId}/permissions`, {
    allAgents: true,
    method: 'POST',
    body: { canAccess, programsCanAccess, permissions, classesCanAccess, isPublic },
  });
}

export default setPermissions;
