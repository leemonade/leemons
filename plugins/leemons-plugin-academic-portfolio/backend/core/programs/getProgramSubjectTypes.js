const _ = require('lodash');

async function getProgramSubjectTypes({ ids, ctx }) {
  return ctx.tx.db.SubjectTypes.find({ program: _.isArray(ids) ? ids : [ids] }).lean();
}

module.exports = { getProgramSubjectTypes };
