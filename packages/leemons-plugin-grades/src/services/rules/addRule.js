const _ = require('lodash');
const { table } = require('../tables');
const { validateAddRule } = require('../../validations/forms');
const { addConditionGroup } = require('../condition-groups/addConditionGroup');
const { ruleByIds } = require('./ruleByIds');

async function addRule(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddRule(data);

      const { group, ..._data } = data;

      const rule = await table.rules.create(_data, { transacting });

      const _group = await addConditionGroup({ ...group, rule: rule.id }, { transacting });

      await table.rules.update({ id: rule.id }, { group: _group.id }, { transacting });

      return (await ruleByIds(rule.id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { addRule };
