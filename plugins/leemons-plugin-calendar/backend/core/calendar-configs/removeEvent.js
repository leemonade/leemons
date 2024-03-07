const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
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
async function removeEvent({ config, event: eventId, ctx }) {
  await validateNotExistCalendarConfig({ id: config, ctx });
  const [calendars, event] = await Promise.all([
    getCalendars({ id: config, ctx }),
    detail({ id: eventId, ctx }),
  ]);
  const calendar = _.find(calendars, { id: event.calendar });
  if (!calendar) {
    throw new LeemonsError(ctx, {
      message: `The calendar ${event.calendar} not exist in this config calendars`,
    });
  }
  return removeOrCancel(event.id, { forceDelete: true, transacting });
}

module.exports = { removeEvent };
