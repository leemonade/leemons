module.exports = async function removeModule({ id, ctx }) {
  // TODO: For now remove all the versions in the same status
  return ctx.tx.call('assignables.assignables.removeAssignable', {
    assignable: id,
    removeAll: 1,
  });
};
