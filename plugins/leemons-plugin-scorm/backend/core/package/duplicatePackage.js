async function duplicatePackage({ id, published, ctx }) {
  return ctx.tx.call('assignables.assignables.duplicateAssignable', {
    assignableId: id,
    published,
  });
}

module.exports = duplicatePackage;
