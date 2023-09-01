const _ = require('lodash');
const { validateUpdateRule } = require('../../validations/forms');
const { addConditionGroup } = require('../condition-groups/addConditionGroup');
const { ruleByIds } = require('./ruleByIds');
const { removeConditionGroupsByRule } = require('../condition-groups/removeConditionGroupsByRule');

async function updateRule({ data, isDependency = false, ctx }) {
  await validateUpdateRule({ data, isDependency });

  const { id, group, ..._data } = data;

  const rule = await ctx.tx.db.Rules.findOneAndUpdate(
    { id, isDependency },
    { ..._data, group: null },
    { new: true, lean: true }
  );

  // ES: Solo borramos los grupos por que hace un delete cascade y se borran las condiciones de dichos grupos
  // EN: Only delete the groups because it does a delete cascade and the conditions of those groups are deleted
  await removeConditionGroupsByRule({ ruleId: id, ctx });

  const _group = await addConditionGroup({ data: { ...group, rule: rule.id }, ctx });

  await ctx.tx.db.Rules.updateOne({ id: rule.id, isDependency }, { group: _group.id });

  return (await ruleByIds({ ids: rule.id, ctx }))[0];
}

module.exports = { updateRule };
