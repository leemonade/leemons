/* eslint-disable no-param-reassign */

async function assignFeedback({ id, data, ctx }) {
  return ctx.tx.call('assignables.assignableInstances.createAssignableInstance', {
    assignableInstance: {
      assignable: id,
      ...data,
    },
  });
}

module.exports = assignFeedback;
