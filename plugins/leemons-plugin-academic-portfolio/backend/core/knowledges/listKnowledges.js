const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listKnowledgeAreas({ page, size, center, ctx }) {
  const knowledgeAreasData = await mongoDBPaginate({
    model: ctx.tx.db.Knowledges,
    page,
    size,
    query: {
      center,
    },
  });

  const knowledgeAreasIds = knowledgeAreasData.items.map((item) => item.id);

  const notRemovableKnowledgeAreas = await ctx.tx.db.ClassKnowledges.find({
    knowledge: knowledgeAreasIds,
  }).lean();

  const notRemovablesIds = notRemovableKnowledgeAreas.map((item) => item.knowledge);

  knowledgeAreasData.items = knowledgeAreasData.items.map((item) => ({
    ...item,
    removable: !notRemovablesIds.includes(item.id),
  }));
  return knowledgeAreasData;
}

module.exports = { listKnowledges: listKnowledgeAreas };
