const _ = require('lodash');

const { validateNotExistCalendarKey } = require('../../validations/exists');

const { getEvents } = require('./getEvents');

/**
 * Return calendar if exists
 * @public
 * @static
 * @param {string} key - key
 * @param {boolean} withEvents - with events
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detailByKey({ key, withEvents, ctx }) {
  await validateNotExistCalendarKey({ key, ctx });
  const calendar = await ctx.tx.db.Calendars.findOne({ key }).lean();

  if (withEvents) {
    calendar.events = await getEvents({ calendar: calendar.id, ctx });
  }

  return calendar;
}

module.exports = { detailByKey };
