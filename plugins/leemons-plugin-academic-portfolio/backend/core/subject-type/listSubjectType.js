const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listSubjectType({ page, size, program, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.SubjectTypes,
    page,
    size,
    query: { program },
  });
}

module.exports = { listSubjectType };
