const createAssignableFromAsset = require('./createAssignableFromAsset');

module.exports = async function assignAsset({ assignable, instance, ctx }) {
  const createdAssignable = await createAssignableFromAsset({ assignable, ctx });
  const assignableId = createdAssignable.id;

  return ctx.tx.call('assignables.assignableInstances.createAssignableInstance', {
    assignableInstance: {
      assignable: assignableId,
      ...instance,
    },
  });
};
