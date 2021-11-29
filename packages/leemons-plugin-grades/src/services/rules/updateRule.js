const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateRule } = require('../../validations/forms');
const { addConditionGroup } = require('../condition-groups/addConditionGroup');
const { ruleByIds } = require('./ruleByIds');
const { removeConditionGroupsByRule } = require('../condition-groups/removeConditionGroupsByRule');

async function updateRule(data, { isDependency = false, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateRule(data, isDependency);

      const { id, group, ..._data } = data;

      const rule = await table.rules.update(
        { id, isDependency },
        { ..._data, group: null },
        { transacting }
      );

      // ES: Solo borramos los grupos por que hace un delete cascade y se borran las condiciones de dichos grupos
      // EN: Only delete the groups because it does a delete cascade and the conditions of those groups are deleted
      await removeConditionGroupsByRule(id, { transacting });

      const _group = await addConditionGroup({ ...group, rule: rule.id }, { transacting });

      await table.rules.update(
        { id: rule.id, isDependency },
        { group: _group.id },
        { transacting }
      );

      return (await ruleByIds(rule.id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { updateRule };
