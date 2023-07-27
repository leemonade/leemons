async function exists({ zoneKey, key, ctx }) {
  const count = await ctx.tx.db.WidgetItem.countDocuments({ zoneKey, key });
  return !!count;
}

module.exports = { exists };
