const _ = require('lodash');
const { validateNotExistCalendar } = require('../../validations/exists');

/**
 *
 * @public
 * @static
 * @param {string} calendar
 * @param {boolean} getPrivates
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getEvents({ calendar, getPrivates = true, ctx }) {
  await validateNotExistCalendar({ id: calendar, ctx });
  const eventCalendars = await ctx.tx.db.EventCalendar.find({ calendar }).lean();

  const query = { id: _.map(eventCalendars, 'event') };
  if (!getPrivates) query.isPrivate = false;
  const events = await ctx.tx.db.Events.find(query).lean();
  return _.map(events, (event) => ({
    ...event,
    calendar,
    data: _.isString(event.data) ? JSON.parse(event.data) : event.data,
  }));
}

async function getEventsMultipleCalendars({ calendars: _calendars, getPrivates = true, ctx }) {
  const calendars = _.isArray(_calendars) ? _calendars : [_calendars];
  const eventCalendars = await ctx.tx.db.EventCalendar.find({ calendar: calendars }).lean();
  const query = { id: _.uniq(_.map(eventCalendars, 'event')) };
  if (!getPrivates) query.isPrivate = false;
  const events = await ctx.tx.db.Events.find(query).lean();
  const eventsById = _.keyBy(events, 'id');
  const eventCalendarsByCalendar = _.groupBy(eventCalendars, 'calendar');

  const result = [];

  _.forEach(calendars, (calendarId) => {
    const ev = [];
    _.forEach(_.map(eventCalendarsByCalendar[calendarId], 'event'), (eventId) => {
      if (eventsById[eventId]) {
        ev.push({
          ...eventsById[eventId],
          calendar: calendarId,
          data: _.isString(eventsById[eventId]?.data)
            ? JSON.parse(eventsById[eventId].data)
            : eventsById[eventId]?.data,
        });
      }
    });

    result.push(ev);
  });

  return result;
}

module.exports = { getEvents, getEventsMultipleCalendars };
