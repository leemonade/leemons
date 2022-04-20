const getAssignable = require('../assignable/getAssignable');
const { assignableInstances } = require('../tables');

module.exports = async function getAssignableInstance(
  id,
  { relatedAssignableInstances, details, userSession, transacting } = {}
) {
  let assignableInstance;
  try {
    assignableInstance = await assignableInstances.findOne({ id }, { transacting });

    assignableInstance.curriculum = JSON.parse(assignableInstance.curriculum);
    assignableInstance.metadata = JSON.parse(assignableInstance.metadata);
    assignableInstance.relatedAssignableInstances = JSON.parse(
      assignableInstance.relatedAssignableInstances
    );
  } catch (e) {
    throw new Error("The assignable instance doesn't exist or you don't have access");
  }

  if (details) {
    try {
      assignableInstance.assignable = await getAssignable.call(
        this,
        assignableInstance.assignable,
        { userSession, transacting }
      );
    } catch (e) {
      throw new Error(`Error geting ${id} details: ${e.message}`);
    }
  }

  try {
    if (relatedAssignableInstances && assignableInstance.relatedAssignableInstances?.length) {
      assignableInstance.relatedAssignableInstances = await Promise.all(
        assignableInstance.relatedAssignableInstances.map(async (relatedAssignableInstance) =>
          getAssignableInstance.call(this, relatedAssignableInstance, {
            relatedAssignableInstances,
            details,
            userSession,
            transacting,
          })
        )
      );
    }
  } catch (e) {
    throw new Error('Error getting related assignable instances');
  }

  return assignableInstance;
};
