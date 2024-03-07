async function existKnowledgeInProgram({ id, program, ctx }) {
  const count = await ctx.tx.db.Knowledges.countDocuments({ id, program });
  return count > 0;
}

module.exports = { existKnowledgeInProgram };
