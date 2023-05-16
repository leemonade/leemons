const _ = require('lodash');
const { table } = require('../tables');

async function getConditionsByRule(ids, { transacting } = {}) {
  const results = await table.conditions.find(
    { rule_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );
  return _.map(results, (result) => ({
    ...result,
    sourceIds: JSON.parse(result.sourceIds),
    dataTargets: JSON.parse(result.dataTargets),
  }));
}

module.exports = { getConditionsByRule };
