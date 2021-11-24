const _ = require('lodash');
const { table } = require('../tables');
const { validateAddRule } = require('../../validations/forms');

async function addConditionGroup(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddRule(data);

      const { group, ..._data } = data;

      let rule = await table.rules.create(_data, { transacting });

      const group = await

        rule = await table.rules.update({id: rule.id}, {group: group.id}, {transacting});

      return (await gradeByIds(grade.id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { addConditionGroup };
