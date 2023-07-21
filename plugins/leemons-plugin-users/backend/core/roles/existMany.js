async function existMany({ ids, ctx }) {
  const response = await ctx.tx.db.Roles.countDocuments({ id: ids });
  return response === ids.length;
}

module.exports = existMany;
