const { table } = require('../tables');
const { validateNotExistCalendar } = require('../../validations/exists');
const _ = require('lodash');

/**
 *
 * @public
 * @static
 * @param {string} calendar
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getEvents(calendar, { transacting } = {}) {
  await validateNotExistCalendar(calendar);
  const eventCalendars = await table.eventCalendar.find({ calendar }, { transacting });
  const events = await table.events.find(
    { id_$in: _.map(eventCalendars, 'event') },
    { transacting }
  );
  return _.map(events, (event) => ({
    ...event,
    calendar,
    data: _.isString(event.data) ? JSON.parse(event.data) : event.data,
  }));
}

module.exports = { getEvents };
