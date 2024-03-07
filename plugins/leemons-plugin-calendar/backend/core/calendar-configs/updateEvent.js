const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateNotExistCalendarConfig } = require('../../validations/exists');
const { getCalendars } = require('./getCalendars');
const { update: updateEventE } = require('../events');

/**
 * Add calendar config
 * @public
 * @static
 * @param {string} config - config id
 * @param {any} event - event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function updateEvent({ config, event, ctx }) {
  await validateNotExistCalendarConfig({ id: config, ctx });
  const calendars = await getCalendars({ id: config, ctx });
  const calendar = _.find(calendars, { id: event.calendar });
  if (!calendar) {
    throw new LeemonsError(ctx, {
      message: `The calendar ${event.calendar} not exist in this config calendars`,
    });
  }

  const { id, calendar: __, status: ___, ...rest } = event;
  return updateEventE({ id, data: rest, calendar: calendar.id, ctx });
}

module.exports = { updateEvent };
