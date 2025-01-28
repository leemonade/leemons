async function getRetakes({ classId, period, ctx }) {
  const retakes = await ctx.tx.db.Retakes.find({ classId, period })
    .sort({ index: 1 })
    .select({ index: 1, id: 1, _id: 0 })
    .lean();

  if (retakes[0]?.index !== 0) {
    retakes.unshift({ id: null, index: 0 });
  }

  return retakes;
}

module.exports = getRetakes;
