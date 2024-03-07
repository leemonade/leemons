const _ = require('lodash');

async function getProgramKnowledges({ ids, ctx }) {
  return ctx.tx.db.Knowledges.find({ program: _.isArray(ids) ? ids : [ids] }).lean();
}

module.exports = { getProgramKnowledges };
