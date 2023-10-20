async function checkIfStudentIsOnInstance({ user, instance, ctx }) {
  const assignationsCount = await ctx.tx.db.Assignations.countDocuments({
    instance,
    user,
  });

  return assignationsCount > 0;
}

module.exports = { checkIfStudentIsOnInstance };
