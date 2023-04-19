module.exports = async function createModule(module, { published, userSession, transacting } = {}) {
  const assignablesServices = leemons.getPlugin('assignables').services.assignables;

  const createdModule = await assignablesServices.createAssignable(
    { ...module, role: 'learningpaths.module' },
    {
      published,
      userSession,
      transacting,
    }
  );

  return createdModule;
};
