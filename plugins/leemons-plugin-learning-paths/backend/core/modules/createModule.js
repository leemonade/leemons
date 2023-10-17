module.exports = async function createModule({ module, published, ctx }) {
  return ctx.tx.call('assignables.assignables.createAssignable', {
    assignable: { ...module, role: 'learningpaths.module' },
    published,
  });
};
