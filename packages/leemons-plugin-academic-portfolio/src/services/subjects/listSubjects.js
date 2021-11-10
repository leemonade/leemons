const { table } = require('../tables');

async function listSubjects(page, size, program, { transacting } = {}) {
  return global.utils.paginate(
    table.subjects,
    page,
    size,
    { program },
    {
      transacting,
    }
  );
}

module.exports = { listSubjects };
