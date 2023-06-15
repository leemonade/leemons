async function exist({ _id, ctx }) {
  const response = await ctx.tx.db.Roles.countDocuments({ _id });
  return !!response;
}

module.exports = exist;
