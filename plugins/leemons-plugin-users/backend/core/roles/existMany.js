async function existMany({ roles, ctx }) {
  const response = await ctx.tx.db.Roles.countDocuments({ id: roles });
  return response === roles.length;
}

module.exports = existMany;
