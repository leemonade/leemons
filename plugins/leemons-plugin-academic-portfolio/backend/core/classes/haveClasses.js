async function haveClasses({ ctx }) {
  const count = await ctx.tx.db.Class.countDocuments();
  return !!count;
}

module.exports = { haveClasses };
