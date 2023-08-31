const _ = require('lodash');
const { removeConditionGroupsByRule } = require('../condition-groups/removeConditionGroupsByRule');

async function removeRule({ id, isDependency = false, ctx }) {
  const rules = await ctx.tx.db.Rules.find({ id: _.isArray(id) ? id : [id] }).lean();
  const ruleIds = _.map(rules, 'id');
  await ctx.tx.db.Rules.updateMany({ id: ruleIds, isDependency }, { group: null });
  await ctx.tx.emit('before-remove-rules', { rules });
  await removeConditionGroupsByRule({ ruleId: ruleIds, ctx });
  await ctx.tx.db.Rules.deleteMany({ id: ruleIds, isDependency });
  await ctx.tx.emit('after-remove-rules', { rules });
  return true;
}

module.exports = { removeRule };
