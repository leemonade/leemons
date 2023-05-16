const _ = require('lodash');
const { table } = require('../tables');
const { removeConditionsByRule } = require('../conditions/removeConditionsByRule');

async function removeConditionGroupsByRule(ruleId, { transacting } = {}) {
  const conditionGroups = await table.conditionGroups.find(
    { rule_$in: _.isArray(ruleId) ? ruleId : [ruleId] },
    { transacting }
  );
  const conditionsGroupIds = _.map(conditionGroups, 'id');
  await leemons.events.emit('before-remove-condition-groups', { conditionGroups, transacting });
  await removeConditionsByRule(ruleId, { transacting });
  await table.conditionGroups.deleteMany({ id_$in: conditionsGroupIds }, { transacting });
  await leemons.events.emit('after-remove-condition-groups', { conditionGroups, transacting });
  return true;
}

module.exports = { removeConditionGroupsByRule };
