async function setPermissions(
  assetId,
  { canAccess, programsCanAccess, classesCanAccess, isPublic } = {}
) {
  return leemons.api(`leebrary/asset/${assetId}/permissions`, {
    allAgents: true,
    method: 'POST',
    body: { canAccess, programsCanAccess, classesCanAccess, isPublic },
  });
}

export default setPermissions;
