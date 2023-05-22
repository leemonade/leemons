module.exports = async function removeModule(id, { transacting, userSession } = {}) {
  const assignablesServices = leemons.getPlugin('assignables').services.assignables;

  // TODO: For now remove all the versions in the same status
  return assignablesServices.removeAssignable(id, {
    userSession,
    transacting,
    removeAll: 1,
  });
};
