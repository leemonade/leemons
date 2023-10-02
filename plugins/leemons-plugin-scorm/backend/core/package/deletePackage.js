async function deletePackage({ id, ctx }) {
  const { versions } = await ctx.tx.call('assignables.assignables.removeAssignable', {
    assignable: id,
    removeAll: 1,
  });
  return versions;
}

module.exports = deletePackage;
