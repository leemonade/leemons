async function existsInCenter({ id, center, ctx }) {
  const count = await ctx.tx.db.KnowledgeAreas.countDocuments({ id, center });
  return count > 0;
}

module.exports = { existsInCenter };
