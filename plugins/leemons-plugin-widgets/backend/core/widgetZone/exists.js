async function exists({ key, ctx }) {
  const count = await ctx.tx.db.WidgetZone.count({ key });
  return !!count;
}

module.exports = { exists };
