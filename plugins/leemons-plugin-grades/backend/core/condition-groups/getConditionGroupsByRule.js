const _ = require('lodash');

async function getConditionGroupsByRule({ ids, ctx }) {
  return ctx.tx.db.ConditionGroups.find({ rule: _.isArray(ids) ? ids : [ids] }).lean();
}

module.exports = { getConditionGroupsByRule };
