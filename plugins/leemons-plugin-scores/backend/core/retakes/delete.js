async function deleteRetake({ retakeId, ctx }) {
  const { deletedCount } = await ctx.tx.db.Retakes.deleteOne({ id: retakeId });

  return deletedCount;
}

module.exports = deleteRetake;
