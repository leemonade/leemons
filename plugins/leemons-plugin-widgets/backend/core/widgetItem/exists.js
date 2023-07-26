async function exists({ zoneKey, key, ctx }) {
  const count = await ctx.tx.db.WidgetItem.count({ zoneKey, key });
  return !!count;
}

module.exports = { exists };
