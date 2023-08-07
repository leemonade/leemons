async function duplicatePackage(id, { published, userSession, transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;

  const newAssignable = await assignableService.duplicateAssignable(id, {
    published,
    userSession,
    transacting,
  });

  return newAssignable;
}

module.exports = duplicatePackage;
