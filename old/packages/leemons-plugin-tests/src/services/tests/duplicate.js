async function duplicate(taskId, { published, userSession, transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;

  try {
    return assignableService.duplicateAssignable(taskId, {
      published,
      userSession,
      transacting,
    });
  } catch (e) {
    throw new Error(`Error duplicating test: ${e.message}`);
  }
}

module.exports = { duplicate };
