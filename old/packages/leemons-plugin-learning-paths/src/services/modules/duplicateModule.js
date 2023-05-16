module.exports = async function duplicateModule(id, { published, userSession, transacting } = {}) {
  const assignablesServices = leemons.getPlugin('assignables').services.assignables;

  const duplicatedModule = await assignablesServices.duplicateAssignable(id, {
    published,
    userSession,
    transacting,
  });

  return duplicatedModule;
};
