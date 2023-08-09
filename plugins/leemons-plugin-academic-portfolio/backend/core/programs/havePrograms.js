async function havePrograms({ ctx }) {
  const count = await ctx.tx.db.Programs.countDocuments();
  return !!count;
}

module.exports = { havePrograms };
