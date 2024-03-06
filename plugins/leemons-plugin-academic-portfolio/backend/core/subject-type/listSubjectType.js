const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listSubjectType({ page, size, center, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.SubjectTypes,
    page,
    size,
    query: { center },
  });
}

module.exports = { listSubjectType };
