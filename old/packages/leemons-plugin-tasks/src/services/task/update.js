const assignablesServices = require('../assignables');

module.exports = async function update(
  taskId,
  { published, role, ...data },
  { transacting, userSession } = {}
) {
  const { assignables } = assignablesServices();
  try {
    const assignable = await assignables.updateAssignable(
      {
        id: taskId,
        ...data,
      },
      { userSession, transacting }
    );
    const version = await leemons
      .getPlugin('common')
      .services.versionControl.parseId(assignable.id, { transacting });

    return { ...assignable, ...version };

    // TODO: Update attachments
  } catch (error) {
    throw new Error(`Error updating task: ${error.message}`);
  }
};
