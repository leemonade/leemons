async function getLatestRetake({ classId, period, ctx }) {
  const retake = await ctx.tx.db.Retakes.findOne({ classId, period })
    .sort({ index: -1 })
    .select({ index: 1 })
    .lean();

  return retake?.index ?? null;
}

module.exports = getLatestRetake;
