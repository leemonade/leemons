const _ = require('lodash');
const { table } = require('../tables');

/**
 * Add calendar config
 * @public
 * @static
 * @param {any} items - Calendar data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addMany(items, { transacting } = {}) {
  const centerIds = _.map(items, 'center');
  const count = await table.centerCalendarConfigs.count({ center_$in: centerIds }, { transacting });
  if (count) throw new Error('One of the centers is already assigned to a configuration');
  return table.centerCalendarConfigs.createMany(items, { transacting });
}

module.exports = { addMany };
