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

module.exports = { getEvents };
