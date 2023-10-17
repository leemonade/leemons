const _ = require('lodash');

async function getConditionsByRule({ ids, ctx }) {
  const results = await ctx.tx.db.Conditions.find({ rule: _.isArray(ids) ? ids : [ids] }).lean();
  return _.map(results, (result) => ({
    ...result,
    sourceIds: JSON.parse(result.sourceIds),
    dataTargets: JSON.parse(result.dataTargets),
  }));
}

module.exports = { getConditionsByRule };
