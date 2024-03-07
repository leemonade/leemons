async function deleteTest({ id, ctx }) {
  return ctx.tx.call('assignables.assignables.removeAssignable', {
    assignable: id,
    removeAll: 1,
  });
}

module.exports = { deleteTest };
