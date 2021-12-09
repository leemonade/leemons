const { table } = require('../tables');

/**
 * Lista all event types
 * @public
 * @static

 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ transacting } = {}) {
  return table.eventTypes.find(undefined, { transacting });
}

module.exports = { list };
