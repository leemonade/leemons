const _ = require('lodash');
const { table } = require('../tables');
const { validateAddRule } = require('../../validations/forms');
const { addConditionGroup } = require('../condition-groups/addConditionGroup');
const { ruleByIds } = require('./ruleByIds');
const enableMenuItemService = require('../menu-builder/enableItem');

async function addRule(data, { isDependency = false, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddRule(data, isDependency);

      const { group, ..._data } = data;

      const rule = await table.rules.create({ ..._data, isDependency }, { transacting });

      const _group = await addConditionGroup({ ...group, rule: rule.id }, { transacting });

      await table.rules.update({ id: rule.id }, { group: _group.id }, { transacting });

      await Promise.all([
        enableMenuItemService('promotions'),
        enableMenuItemService('dependencies'),
      ]);
      return (await ruleByIds(rule.id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { addRule };
