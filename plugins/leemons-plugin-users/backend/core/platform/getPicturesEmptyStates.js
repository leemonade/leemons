async function getPicturesEmptyStates({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-pictures-empty-states' }).lean();
  return Boolean(config?.value);
}

module.exports = getPicturesEmptyStates;
