async function sharePackage(
  id,
  { canAccess, programsCanAccess, classesCanAccess, isPublic },
  { transacting, userSession } = {}
) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  await Promise.all(
    canAccess.map(({ userAgent, role }) =>
      assignableService.addUserToAssignable(id, [userAgent], role, { userSession, transacting })
    )
  );
}

module.exports = sharePackage;
