const { table } = require('../tables');
const { validateNotExistCalendar } = require('../../validations/exists');

/**
 * Return calendar if exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail(id, { transacting } = {}) {
  await validateNotExistCalendar(id);
  return table.calendars.findOne({ id }, { transacting });
}

module.exports = { detail };
