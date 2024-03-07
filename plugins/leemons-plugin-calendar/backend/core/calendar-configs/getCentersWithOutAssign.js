const _ = require('lodash');

/**
 *
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getCentersWithOutAssign({ ctx }) {
  const [centerCalendars, centers] = await Promise.all([
    ctx.tx.db.CenterCalendarConfigs.find({}).lean(),
    ctx.tx.call('users.centers.list', { page: 0, size: 99999 }),
  ]);
  return _.differenceBy(centers.items, centerCalendars, (item) => item.center || item.id);
}

module.exports = { getCentersWithOutAssign };
