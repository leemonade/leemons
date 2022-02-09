const _ = require('lodash');
const { table } = require('../tables');
const { removeConditionGroupsByRule } = require('../condition-groups/removeConditionGroupsByRule');

async function removeRule(id, { isDependency = false, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const rules = await table.rules.find({ id_$in: _.isArray(id) ? id : [id] });
      const ruleIds = _.map(rules, 'id');
      await table.rules.update({ id_$in: ruleIds, isDependency }, { group: null }, { transacting });
      await leemons.events.emit('before-remove-rules', { rules, transacting });
      await removeConditionGroupsByRule(ruleIds, { transacting });
      await table.rules.deleteMany({ id_$in: ruleIds, isDependency }, { transacting });
      await leemons.events.emit('after-remove-rules', { rules, transacting });
      return true;
    },
    table.rules,
    _transacting
  );
}

module.exports = { removeRule };
