async function exist({ id, ctx }) {
  const response = await ctx.tx.db.Roles.countDocuments({ id });
  return !!response;
}

module.exports = exist;
