const _ = require('lodash');
const { table } = require('../tables');
const { validateAddConditionGroup } = require('../../validations/forms');

// eslint-disable-next-line no-use-before-define
module.exports = { addConditionGroup };

const { addCondition } = require('../conditions/addCondition');

async function addConditionGroup(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddConditionGroup(data);

      const { conditions, ..._data } = data;

      const conditionGroup = await table.conditionGroups.create(_data, { transacting });

      if (conditions) {
        await Promise.all(
          _.map(conditions, async (condition) =>
            addCondition(
              { ...condition, rule: data.rule, parentGroup: conditionGroup.id },
              { transacting }
            )
          )
        );
      }

      return conditionGroup;
    },
    table.grades,
    _transacting
  );
}
