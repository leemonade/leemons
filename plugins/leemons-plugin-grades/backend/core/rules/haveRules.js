async function haveRules({ isDependency = false, ctx }) {
  const count = await ctx.tx.db.Rules.countDocuments({ isDependency });
  return !!count;
}

module.exports = { haveRules };
