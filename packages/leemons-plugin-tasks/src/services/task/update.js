const assignablesServices = require('../assignables');

const { assignables } = assignablesServices;

module.exports = async function update(taskId, data, { transacting, userSession } = {}) {
  try {
    return await assignables.updateAssignable(
      {
        id: taskId,
        ...data,
      },
      { userSession, transacting }
    );

    // TODO: Update attachments
  } catch (error) {
    throw new Error(`Error updating task: ${error.message}`);
  }
};
