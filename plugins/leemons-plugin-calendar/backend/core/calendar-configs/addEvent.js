const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
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
async function addEvent({ config, event, ctx }) {
  await validateNotExistCalendarConfig({ id: config, ctx });
  const calendars = await getCalendars({ id: config });
  const calendar = _.find(calendars, { id: event.calendar });
  if (!calendar) {
    throw new LeemonsError(ctx, {
      message: `The calendar ${event.calendar} not exist in this config calendars`,
    });
  }
  const { calendar: __, ...ev } = event;
  return addEventE({ key: calendar.key, data: ev, ignoreType: true, ctx });
}

module.exports = { addEvent };
