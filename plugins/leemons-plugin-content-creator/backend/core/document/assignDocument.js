/* eslint-disable no-param-reassign */

async function assignDocument({ id, data, ctx }) {
  return ctx.tx.call('assignables.assignableInstances.createAssignableInstance', {
    assignableInstance: {
      assignable: id,
      ...data,
    },
  });
}

module.exports = assignDocument;
