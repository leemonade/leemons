const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');

async function listStudentClasses(page, size, student, { transacting } = {}) {
  const response = await global.utils.paginate(
    table.classStudent,
    page,
    size,
    { student_$in: _.isArray(student) ? student : [student] },
    {
      transacting,
    }
  );

  response.items = await classByIds(_.map(response.items, 'class'), { transacting });

  return response;
}

module.exports = { listStudentClasses };
