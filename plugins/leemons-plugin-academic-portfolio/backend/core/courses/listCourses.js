const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listCourses({ page, size, program, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.Groups,
    page,
    size,
    query: { program, type: 'course' },
  });
}

module.exports = { listCourses };
