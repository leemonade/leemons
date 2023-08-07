const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistCalendarConfig } = require('../../validations/exists');
const { getCalendars } = require('./getCalendars');
const { removeOrCancel, detail } = require('../events');

/**
 * Add calendar config
 * @public
 * @static
 * @param {string} config - config id
 * @param {any} event - event id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeEvent(config, eventId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistCalendarConfig(config, { transacting });
      const [calendars, event] = await Promise.all([
        getCalendars(config, { transacting }),
        detail(eventId, { transacting }),
      ]);
      const calendar = _.find(calendars, { id: event.calendar });
      if (!calendar) {
        throw new Error(`The calendar ${event.calendar} not exist in this config calendars`);
      }
      return await removeOrCancel(event.id, { forceDelete: true, transacting });
    },
    table.calendars,
    _transacting
  );
}

module.exports = { removeEvent };
