async function removeManualActivity({ id, ctx }) {
  const { deletedCount } = await ctx.tx.db.ManualActivities.deleteOne({ id });

  return deletedCount > 0;
}

module.exports = removeManualActivity;
