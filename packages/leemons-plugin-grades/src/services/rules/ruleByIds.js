const _ = require('lodash');
const { table } = require('../tables');
const { getRuleConditionsByRuleIds } = require('./getRuleConditionsByRuleIds');

async function ruleByIds(ids, { transacting } = {}) {
  const [rules, ruleConditions] = await Promise.all([
    table.rules.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    getRuleConditionsByRuleIds(ids, { transacting }),
  ]);

  return _.map(rules, (rule) => ({
    ...rule,
    group: ruleConditions[rule.id].tree,
  }));
}

module.exports = { ruleByIds };
