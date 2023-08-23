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
async function detail({ id, withEvents, ctx }) {
  await validateNotExistCalendar({ id, ctx });
  const calendar = await ctx.tx.db.Calendars.findOne({ id }).lean();
  if (withEvents) {
    calendar.events = await getEvents({ calendar: id, ctx });
  }
  return calendar;
}

module.exports = { detail };
