async function getKnowledgeAreaById({ id, ctx }) {
  const knowledgeArea = await ctx.tx.db.KnowledgeAreas.findOne({ id }).lean();
  const manager = await ctx.tx.db.Managers.findOne({ relationship: id }).lean();
  return {
    ...knowledgeArea,
    manager: manager?.userAgent ?? null,
  };
}

module.exports = { getKnowledgeAreaById };
