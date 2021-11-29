const _ = require('lodash');
const { table } = require('../tables');

async function removeConditionsByRule(ids, { transacting } = {}) {
  const conditions = await table.conditions.find(
    { rule_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );
  const conditionIds = _.map(conditions, 'id');
  await leemons.events.emit('before-remove-conditions', { conditions, transacting });
  await table.conditions.deleteMany({ id_$in: conditionIds }, { transacting });
  await leemons.events.emit('after-remove-conditions', { conditions, transacting });
  return true;
}

module.exports = { removeConditionsByRule };
