const { map } = require('lodash');

/**
 * Updates an event in the calendar.
 *
 * @param {Object} eventId - The ID of the event to be updated.
 * @param {Boolean} assignable - Whether or not the event is assignable.
 * @param {Array} classes - The classes associated with the event.
 * @param {Object} dates - The start and end dates of the event.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @returns {Promise} - A promise that resolves to the updated event.
 */
async function updateEvent({ eventId, assignable, classes, dates, ctx, withTX = true }) {
  let { call } = ctx;
  if (withTX) call = ctx.tx.call;
  return call('calendar.calendar.updateEvent', {
    //
    id: eventId,
    data: {
      title: assignable.asset.name,
      isPrivate: true,
      type: 'calendar.task',
      startDate: dates.startDate instanceof Date ? dates.startDate.toISOString() : dates.startDate,
      endDate: dates.deadline instanceof Date ? dates.deadline.toISOString() : dates.deadline,
    },
    calendar: map(classes, (classe) => `calendar.class.${classe}`),
  });
}

module.exports = { updateEvent };
