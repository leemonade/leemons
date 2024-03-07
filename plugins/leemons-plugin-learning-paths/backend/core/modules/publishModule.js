module.exports = async function publishModule({ id, ctx }) {
  // TODO: For now remove all the versions in the same status
  return ctx.tx.call('assignables.assignables.publishAssignable', {
    assignableId: id,
  });
};
