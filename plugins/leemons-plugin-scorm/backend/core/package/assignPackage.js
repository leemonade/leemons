async function assignPackage({ id, data, ctx }) {
  return ctx.tx.call('assignables.assignableInstances.createAssignableInstance', {
    assignableInstance: {
      assignable: id,
      ...data,
    },
  });
}

module.exports = assignPackage;
