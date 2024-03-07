const _ = require('lodash');
const { validateAddCondition } = require('../../validations/forms');

// eslint-disable-next-line no-use-before-define
module.exports = { addCondition };

const { addConditionGroup } = require('../condition-groups/addConditionGroup');

async function addCondition({ data, ctx }) {
  await validateAddCondition({ ...data });

  const { group, sourceIds, dataTargets, ..._data } = data;

  if (group) {
    const _group = await addConditionGroup({ data: { ...group, rule: data.rule }, ctx });
    _data.childGroup = _group.id;
  }

  const result = await ctx.tx.db.Conditions.create({
    ..._data,
    sourceIds: JSON.stringify(sourceIds),
    dataTargets: JSON.stringify(dataTargets),
  });
  return result.toObject();
}
