const _ = require('lodash');
const { table } = require('../tables');

async function removeConditionGroupsByRule(ruleId, { transacting } = {}) {
  await table.conditionGroups.deleteMany(
    { rule_$in: _.isArray(ruleId) ? ruleId : [ruleId] },
    { transacting }
  );
  return true;
}

module.exports = { removeConditionGroupsByRule };
