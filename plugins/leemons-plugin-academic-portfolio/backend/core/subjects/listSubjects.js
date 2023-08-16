const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listSubjects({ page, size, program, course, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.Subjects,
    page,
    size,
    query: { program, course },
  });
}

module.exports = { listSubjects };
