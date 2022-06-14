const assignablesServices = require('../assignables');

async function duplicate(taskId, { published, userSession, transacting } = {}) {
  const { assignables } = assignablesServices();

  try {
    const task = await assignables.duplicateAssignable(taskId, {
      published,
      userSession,
      transacting,
    });

    return task;
  } catch (e) {
    throw new Error(`Error duplicating task: ${e.message}`);
  }
}

module.exports = duplicate;
