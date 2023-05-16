async function deleteTest(id, { userSession, transacting } = {}) {
  const { assignables } = leemons.getPlugin('assignables').services;
  return assignables.removeAssignable(id, { userSession, transacting, removeAll: 1 });
}

module.exports = { deleteTest };
