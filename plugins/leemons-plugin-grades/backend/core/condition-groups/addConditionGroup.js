const _ = require('lodash');
const { validateAddConditionGroup } = require('../../validations/forms');

// eslint-disable-next-line no-use-before-define
module.exports = { addConditionGroup };

const { addCondition } = require('../conditions/addCondition');

async function addConditionGroup({ data, ctx }) {
  await validateAddConditionGroup({ data });

  const { conditions, ..._data } = data;

  let conditionGroup = await ctx.tx.db.ConditionGroups.create(_data);
  conditionGroup = conditionGroup.toObject();

  if (conditions) {
    await Promise.all(
      _.map(conditions, async (condition) =>
        addCondition({
          data: { ...condition, rule: data.rule, parentGroup: conditionGroup.id },
          ctx,
        })
      )
    );
  }

  return conditionGroup;
}
