const _ = require('lodash');
const { table } = require('../tables');

/**
 * Check if the calendar key already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function existByKey(key, { transacting } = {}) {
  const count = await table.calendars.count({ key }, { transacting });
  return !!count;
}

module.exports = { existByKey };
