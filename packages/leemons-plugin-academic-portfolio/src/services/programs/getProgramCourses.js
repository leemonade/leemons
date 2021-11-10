const _ = require('lodash');
const { table } = require('../tables');

async function getProgramCourses(ids, { transacting } = {}) {
  return table.groups.find(
    { program_$in: _.isArray(ids) ? ids : [ids], type: 'course' },
    { transacting }
  );
}

module.exports = { getProgramCourses };
