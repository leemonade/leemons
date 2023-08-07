async function getClassProgram({ id, ctx }) {
  const classe = await ctx.tx.db.Class.findOne({ id }).lean();
  return ctx.tx.db.Programs.findOne({ id: classe.program }).lean();
}

module.exports = { getClassProgram };
