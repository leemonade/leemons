const assignablesServices = require('../assignables');

module.exports = async function publish(taskId, { transacting, userSession } = {}) {
  const { assignables } = assignablesServices();
  try {
    return await assignables.publishAssignable(taskId, { userSession, transacting });
  } catch (e) {
    throw new Error(`Error publishing task: ${e.message}`);
  }
};
