const { table } = require('../tables');

async function listCourses(page, size, program, { transacting } = {}) {
  return global.utils.paginate(
    table.groups,
    page,
    size,
    { program, type: 'course' },
    {
      transacting,
    }
  );
}

module.exports = { listCourses };
