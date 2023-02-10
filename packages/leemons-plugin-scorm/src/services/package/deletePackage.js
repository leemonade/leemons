async function deletePackage(id, { userSession, transacting } = {}) {
  const { assignables } = leemons.getPlugin('assignables').services;

  const { versions } = await assignables.removeAssignable(id, {
    userSession,
    transacting,
    removeAll: 1,
  });

  return versions;
}

module.exports = deletePackage;
