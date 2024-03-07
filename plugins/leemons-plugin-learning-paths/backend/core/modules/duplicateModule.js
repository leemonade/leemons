module.exports = async function duplicateModule({ id, published, ctx }) {
  return ctx.tx.call('assignables.assignables.duplicateAssignable', {
    assignableId: id,
    published,
  });
};
