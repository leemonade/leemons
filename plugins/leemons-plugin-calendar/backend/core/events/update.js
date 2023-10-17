const _ = require('lodash');

const { validateUpdateEvent } = require('../../validations/forms');
const { addNexts } = require('../notifications');
const { removeAll } = require('../notifications/removeAll');
const { addToCalendar } = require('./addToCalendar');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} id - key
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update({ id, data, calendar, ctx }) {
  validateUpdateEvent(data);

  // eslint-disable-next-line no-param-reassign
  if (data.startDate) data.startDate = data.startDate.slice(0, 19).replace('T', ' ');
  // eslint-disable-next-line no-param-reassign
  if (data.endDate) data.endDate = data.endDate.slice(0, 19).replace('T', ' ');

  const toSave = {
    ...data,
    data: _.isObject(data.data) ? JSON.stringify(data.data) : data.data,
  };
  if (calendar) {
    const calendars = _.isArray(calendar) ? calendar : [calendar];
    await ctx.tx.db.EventCalendar.deleteMany({ event: id });
    await addToCalendar({ eventIds: id, calendarIds: calendars, ctx });
  }
  const event = await ctx.tx.db.Events.findOneAndUpdate({ id }, toSave, { new: true, lean: true });

  await removeAll({ eventId: event.id, ctx });
  await addNexts({ eventId: event.id, ctx });
  return { ...event, data: _.isString(event.data) ? JSON.parse(event.data) : event.data };
}

module.exports = { update };
