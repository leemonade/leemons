const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistCalendarKey } = require('../../validations/exists');

/**
 * Return calendar if exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detailByKey(key, { transacting } = {}) {
  await validateNotExistCalendarKey(key, { transacting });
  return table.calendars.findOne({ key }, { transacting });
}

module.exports = { detailByKey };
