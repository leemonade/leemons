const _ = require('lodash');
const { table } = require('../tables');
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
async function getEvents(calendar, { getPrivates = true, transacting } = {}) {
  await validateNotExistCalendar(calendar);
  const eventCalendars = await table.eventCalendar.find({ calendar }, { transacting });

  const query = { id_$in: _.map(eventCalendars, 'event') };
  if (!getPrivates) query.isPrivate = false;
  const events = await table.events.find(query, { transacting });
  return _.map(events, (event) => ({
    ...event,
    calendar,
    data: _.isString(event.data) ? JSON.parse(event.data) : event.data,
  }));
}

async function getEventsMultipleCalendars(_calendars, { getPrivates = true, transacting } = {}) {
  const calendars = _.isArray(_calendars) ? _calendars : [_calendars];
  const eventCalendars = await table.eventCalendar.find(
    { calendar_$in: calendars },
    { transacting }
  );
  const query = { id_$in: _.uniq(_.map(eventCalendars, 'event')) };
  if (!getPrivates) query.isPrivate = false;
  const events = await table.events.find(query, { transacting });
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
