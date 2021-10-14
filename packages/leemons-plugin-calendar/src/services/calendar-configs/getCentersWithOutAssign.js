const _ = require('lodash');
const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getCentersWithOutAssign({ transacting } = {}) {
  const [centerCalendars, centers] = await Promise.all([
    table.centerCalendarConfigs.find({}, { transacting }),
    leemons.getPlugin('users').services.centers.list(0, 99999, { transacting }),
  ]);
  return _.differenceBy(centers.items, centerCalendars, (item) => item.center || item.id);
}

module.exports = { getCentersWithOutAssign };
