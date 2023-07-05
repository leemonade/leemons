async function existMany({ ids, ctx }) {
  const response = await ctx.tx.db.Profiles.countDocuments({ id: ids });
  return response === ids.length;
}

module.exports = { existMany };
