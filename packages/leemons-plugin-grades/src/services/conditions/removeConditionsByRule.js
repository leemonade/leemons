const _ = require('lodash');
const { table } = require('../tables');

async function removeConditionsByRule(ruleId, { transacting } = {}) {
  await table.conditions.deleteMany(
    { rule_$in: _.isArray(ruleId) ? ruleId : [ruleId] },
    { transacting }
  );
  return true;
}

module.exports = { removeConditionsByRule };
