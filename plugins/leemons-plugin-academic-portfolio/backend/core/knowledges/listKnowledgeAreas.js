const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listKnowledgeAreas({ page, size, center, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.KnowledgeAreas,
    page,
    size,
    query: {
      center,
    },
  });
}

module.exports = { listKnowledgeAreas };
