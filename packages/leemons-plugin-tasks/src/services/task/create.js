const assignablesServices = require('../assignables');

const { assignables } = assignablesServices;

module.exports = async function create(
  data,

  { transacting, userSession } = {}
) {
  try {
    const assignableObject = {
      role: 'task',
      ...data,
    };
    const createdAssignable = await assignables.createAssignable(assignableObject, {
      transacting,
      userSession,
    });

    // TODO: Save attachments

    return leemons
      .getPlugin('common')
      .services.versionControl.parseId(createdAssignable.id, null, { transacting });
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
};
