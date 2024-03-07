const _ = require('lodash');

const { validateNotExistCalendarConfig } = require('../../validations/exists');

/**
 * Delete calendar config
 * @public
 * @static
 * @param {any} id - Config id
 * @param {boolean=} withEvents - If true return calendar events
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getCalendars({ id, withEvents, ctx }) {
  await validateNotExistCalendarConfig({ id, ctx });
  const configCalendars = await ctx.tx.db.CalendarConfigCalendars.find({ config: id }).lean();
  const calendars = await ctx.tx.db.Calendars.find({
    id: _.map(configCalendars, 'calendar'),
  }).lean();
  let eventsByCalendar = null;
  if (withEvents) {
    const events = await ctx.tx.db.Events.find({ calendar: _.map(calendars, 'id') }).lean();
    eventsByCalendar = _.groupBy(
      _.map(events, (event) => ({
        ...event,
        data: _.isString(event.data) ? JSON.parse(event.data || null) : event.data,
      })),
      'calendar'
    );
  }
  return _.map(calendars, (calendar) => ({
    ...calendar,
    events: eventsByCalendar ? eventsByCalendar[calendar.id] || [] : [],
  }));
}

module.exports = { getCalendars };
