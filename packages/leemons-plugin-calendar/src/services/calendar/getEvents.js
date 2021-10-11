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
  const events = await table.events.find({ calendar }, { transacting });
  return _.map(events, (event) => ({
    ...event,
    data: _.isString(event.data) ? JSON.parse(event.data) : event.data,
  }));
}

module.exports = { getEvents };
