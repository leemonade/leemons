const _ = require('lodash');
const { table } = require('../tables');

async function getConditionsByRule(ids, { transacting } = {}) {
  return table.conditions.find({ rule_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
}

module.exports = { getConditionsByRule };
