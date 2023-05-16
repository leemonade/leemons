module.exports = async function publishModule(id, { transacting, userSession } = {}) {
  const assignablesServices = leemons.getPlugin('assignables').services.assignables;

  // TODO: For now remove all the versions in the same status
  return assignablesServices.publishAssignable(id, {
    userSession,
    transacting,
    removeAll: 1,
  });
};
