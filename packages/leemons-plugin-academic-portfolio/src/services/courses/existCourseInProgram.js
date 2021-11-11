const { table } = require('../tables');

async function existCourseInProgram(id, program, { transacting } = {}) {
  const count = await table.groups.count({ id, program, type: 'course' }, { transacting });
  return count > 0;
}

module.exports = { existCourseInProgram };
