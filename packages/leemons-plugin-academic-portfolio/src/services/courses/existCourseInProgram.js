const { isArray } = require('lodash');
const { table } = require('../tables');

async function existCourseInProgram(id, program, { transacting } = {}) {
  const ids = isArray(id) ? id : [id];
  const count = await table.groups.count({ id_$in: ids, program, type: 'course' }, { transacting });
  return count === ids.length;
}

module.exports = { existCourseInProgram };
