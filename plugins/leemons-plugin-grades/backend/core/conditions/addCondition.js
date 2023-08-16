const _ = require('lodash');
const { table } = require('../tables');
const { validateAddCondition } = require('../../validations/forms');

// eslint-disable-next-line no-use-before-define
module.exports = { addCondition };

const { addConditionGroup } = require('../condition-groups/addConditionGroup');

async function addCondition(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddCondition(data);

      const { group, sourceIds, dataTargets, ..._data } = data;

      if (group) {
        const _group = await addConditionGroup({ ...group, rule: data.rule }, { transacting });
        _data.childGroup = _group.id;
      }

      return table.conditions.create(
        {
          ..._data,
          sourceIds: JSON.stringify(sourceIds),
          dataTargets: JSON.stringify(dataTargets),
        },
        { transacting }
      );
    },
    table.grades,
    _transacting
  );
}
