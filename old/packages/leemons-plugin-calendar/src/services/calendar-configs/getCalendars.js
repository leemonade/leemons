const _ = require('lodash');
const { table } = require('../tables');

const { validateNotExistCalendarConfig } = require('../../validations/exists');
const { removeByConfigId } = require('../center-calendar-configs');

/**
 * Delete calendar config
 * @public
 * @static
 * @param {any} id - Config id
 * @param {boolean=} withEvents - If true return calendar events
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getCalendars(id, { withEvents, transacting } = {}) {
  await validateNotExistCalendarConfig(id, { transacting });
  const configCalendars = await table.calendarConfigCalendars.find({ config: id }, { transacting });
  const calendars = await table.calendars.find(
    { id_$in: _.map(configCalendars, 'calendar') },
    { transacting }
  );
  let eventsByCalendar = null;
  if (withEvents) {
    const events = await table.events.find(
      { calendar_$in: _.map(calendars, 'id') },
      { transacting }
    );
    eventsByCalendar = _.groupBy(
      _.map(events, (event) => ({
        ...event,
        data: _.isString(event.data) ? JSON.parse(event.data) : event.data,
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
