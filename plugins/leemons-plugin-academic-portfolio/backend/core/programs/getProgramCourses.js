const _ = require('lodash');

async function getProgramCourses({ ids, options = {}, ctx }) {
  return ctx.tx.db.Groups.find(
    { program: _.isArray(ids) ? ids : [ids], type: 'course' },
    '',
    options
  ).lean();
}

module.exports = { getProgramCourses };
