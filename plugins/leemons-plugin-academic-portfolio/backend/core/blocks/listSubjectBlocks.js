const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listSubjectBlocks({ page, size, subjectId, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.Blocks,
    page,
    size,
    query: { subject: subjectId },
  });
}

module.exports = { listSubjectBlocks };
