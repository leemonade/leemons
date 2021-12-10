const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');

async function listTeacherClasses(page, size, teacher, { transacting } = {}) {
  const response = await global.utils.paginate(
    table.classTeacher,
    page,
    size,
    { teacher_$in: _.isArray(teacher) ? teacher : [teacher] },
    {
      transacting,
    }
  );

  response.items = await classByIds(_.map(response.items, 'class'), { transacting });

  return response;
}

module.exports = { listTeacherClasses };
