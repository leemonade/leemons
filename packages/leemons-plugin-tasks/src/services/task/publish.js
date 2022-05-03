const assignablesServices = require('../assignables');

const { assignables } = assignablesServices;

module.exports = async function publish(taskId, { transacting, userSession } = {}) {
  try {
    return await assignables.publishAssignable(taskId, { userSession, transacting });
  } catch (e) {
    throw new Error(`Error publishing task: ${e.message}`);
  }
};
