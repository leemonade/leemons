const _ = require('lodash');
const { getRuleConditionsByRuleIds } = require('./getRuleConditionsByRuleIds');

async function ruleByIds({ ids, ctx }) {
  const [rules, ruleConditions] = await Promise.all([
    ctx.tx.db.Rules.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    getRuleConditionsByRuleIds({ ids, ctx }),
  ]);

  return _.map(rules, (rule) => ({
    ...rule,
    group: ruleConditions[rule.id].tree,
  }));
}

module.exports = { ruleByIds };
