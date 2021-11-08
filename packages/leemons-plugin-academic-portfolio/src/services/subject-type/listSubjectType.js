const { table } = require('../tables');

async function listSubjectType(page, size, program, { transacting } = {}) {
  return global.utils.paginate(
    table.subjectTypes,
    page,
    size,
    { program },
    {
      transacting,
    }
  );
}

module.exports = { listSubjectType };
