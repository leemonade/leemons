const _ = require('lodash');

async function getProgramSubjects({ ids, ctx }) {
  return ctx.tx.db.Subjects.find({ program: _.isArray(ids) ? ids : [ids] }).lean();
}

module.exports = { getProgramSubjects };
