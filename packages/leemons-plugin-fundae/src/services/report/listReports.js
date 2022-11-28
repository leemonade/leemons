const { tables } = require('../tables');

async function listReports(page, size, program, course, { transacting } = {}) {
  return global.utils.paginate(
    tables.report,
    page,
    size,
    { $sort: 'created_at:desc' },
    {
      transacting,
    }
  );
}

module.exports = { listReports };
