const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistCalendarConfig } = require('../../validations/exists');
const { getCalendars } = require('./getCalendars');
const { add: addEventE } = require('../events');

/**
 * Add calendar config
 * @public
 * @static
 * @param {string} config - config id
 * @param {any} event - event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addEvent(config, event, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistCalendarConfig(config, { transacting });
      const calendars = await getCalendars(config, { transacting });
      const calendar = _.find(calendars, { id: event.calendar });
      if (!calendar) {
        throw new Error(`The calendar ${event.calendar} not exist in this config calendars`);
      }
      delete event.calendar;
      return await addEventE(calendar.key, event, { ignoreType: true, transacting });
    },
    table.calendars,
    _transacting
  );
}

module.exports = { addEvent };
