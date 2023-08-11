const _ = require('lodash');
const { table } = require('../tables');

async function getConditionGroupsByRule(ids, { transacting } = {}) {
  return table.conditionGroups.find({ rule_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
}

module.exports = { getConditionGroupsByRule };
