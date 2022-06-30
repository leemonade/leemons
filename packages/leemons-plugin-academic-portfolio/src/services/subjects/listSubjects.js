const { table } = require('../tables');

async function listSubjects(page, size, program, course, { transacting } = {}) {
  return global.utils.paginate(
    table.subjects,
    page,
    size,
    { program, course },
    {
      transacting,
    }
  );
}

module.exports = { listSubjects };
