const _ = require('lodash');
const { validateAddRule } = require('../../validations/forms');
const { addConditionGroup } = require('../condition-groups/addConditionGroup');
const { ruleByIds } = require('./ruleByIds');

async function addRule({ data, isDependency = false, ctx }) {
  await validateAddRule({ data, isDependency });

  const { group, ..._data } = data;

  let rule = await ctx.tx.db.Rules.create({ ..._data, isDependency });
  rule = rule.toObject();

  const _group = await addConditionGroup({ data: { ...group, rule: rule.id }, ctx });

  await ctx.tx.db.Rules.updateOne({ id: rule.id }, { group: _group.id });

  await Promise.allSettled([
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('promotions') }),
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('dependencies') }),
  ]);

  return (await ruleByIds({ ids: rule.id, ctx }))[0];
}

module.exports = { addRule };
