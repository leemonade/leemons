const assignablesServices = require('../assignables');

const { assignables } = assignablesServices;

module.exports = async function remove(taskId, { transacting, userSession } = {}) {
  try {
    // EN: remove the given task.
    // ES: Eliminar la tarea dada.
    // TODO: For now remove all the versions in the same status
    return await assignables.removeAssignable(taskId, { userSession, transacting, removeAll: 1 });
  } catch (e) {
    throw new Error(`Error removing task: ${e.message}`);
  }
};
