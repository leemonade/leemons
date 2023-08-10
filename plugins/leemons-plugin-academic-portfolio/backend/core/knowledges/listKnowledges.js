const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listKnowledges({ page, size, program, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.Knowledges,
    page,
    size,
    query: {
      program,
    },
  });
}

module.exports = { listKnowledges };
