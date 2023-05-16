const { table } = require('../tables');
const { validateNotExistCalendar } = require('../../validations/exists');
const { getEvents } = require('./getEvents');

/**
 * Return calendar if exists
 * @public
 * @static
 * @param {string} id - id
 * @param {boolean} withEvents
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail(id, { withEvents, transacting } = {}) {
  await validateNotExistCalendar(id);
  const calendar = await table.calendars.findOne({ id }, { transacting });
  if (withEvents) {
    calendar.events = await getEvents(id, { transacting });
  }
  return calendar;
}

module.exports = { detail };
