const _ = require('lodash');
const { removeConditionsByRule } = require('../conditions/removeConditionsByRule');

async function removeConditionGroupsByRule({ ruleId, ctx }) {
  const conditionGroups = await ctx.tx.db.ConditionGroups.find({
    rule: _.isArray(ruleId) ? ruleId : [ruleId],
  }).lean();
  const conditionsGroupIds = _.map(conditionGroups, 'id');
  await ctx.tx.emit('before-remove-condition-groups', { conditionGroups });
  await removeConditionsByRule({ ids: ruleId, ctx });
  await ctx.tx.db.ConditionGroups.deleteMany({ id: conditionsGroupIds });
  await ctx.tx.emit('after-remove-condition-groups', { conditionGroups });
  return true;
}

module.exports = { removeConditionGroupsByRule };
