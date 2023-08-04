async function exists({ assetId, ctx } = {}) {
  const count = await ctx.tx.db.Assets.countDocuments({ id: assetId });
  return count > 0;
}

module.exports = { exists };
