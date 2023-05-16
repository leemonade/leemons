const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {any} center - Center id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getByCenterId(center, { transacting } = {}) {
  return table.centerCalendarConfigs.findOne({ center }, { transacting });
}

module.exports = { getByCenterId };
