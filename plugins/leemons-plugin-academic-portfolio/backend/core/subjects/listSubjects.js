const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listSubjects({ page, size, program, course, ctx }) {
  const query = {};
  if (course?.length > 0) query.course = course;
  if (program?.length > 0) query.program = program;

  return mongoDBPaginate({
    model: ctx.tx.db.Subjects,
    page,
    size,
    query,
  });
}

module.exports = { listSubjects };
