const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listSubjects({ page, size, program, course, onlyArchived, ctx }) {
  const query = {};
  if (course?.length > 0) query.course = { $regex: course };
  if (program?.length > 0) query.program = program;

  const results = await mongoDBPaginate({
    model: ctx.tx.db.Subjects,
    page,
    size,
    query,
    options: { ...(onlyArchived ? { excludeDeleted: false } : {}) },
  });

  if (onlyArchived) {
    results.items = results.items.filter((subject) => subject.isDeleted);
  }
  return results;
}

module.exports = { listSubjects };
