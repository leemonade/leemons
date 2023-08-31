async function getDate({ type, instance, name, ctx }) {
  if (!type || !instance || !name) {
    throw new Error('Cannot get dates: type, instance and name are required');
  }
  const dateObject = await ctx.tx.db.Dates.findOne({ type, instance, name })
    .select(['date'])
    .lean();

  return dateObject?.date ?? null;
}

module.exports = { getDate };
