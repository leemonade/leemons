const _ = require('lodash');

async function getProgramCourses({ ids, ctx }) {
  return ctx.tx.db.Groups.find({ program: _.isArray(ids) ? ids : [ids], type: 'course' }).lean();
}

module.exports = { getProgramCourses };
