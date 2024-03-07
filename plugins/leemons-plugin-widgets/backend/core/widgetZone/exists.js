async function exists({ key, ctx }) {
  const count = await ctx.tx.db.WidgetZone.countDocuments({ key });
  return !!count;
}

module.exports = { exists };
