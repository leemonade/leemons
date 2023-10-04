const { map } = require('lodash');

function getDate(date) {
  if (!date) return undefined;
  return typeof date === 'string' ? date : date.toISOString();
}
/**
 * Registers an event in the calendar.
 *
 * @async
 * @param {Object} options - An object containing the following properties:
 * @param {boolean} options.assignable - Whether the event is assignable.
 * @param {string[]} options.classes - An array of classes associated with the event.
 * @param {string} options.id - The ID of the event.
 * @param {boolean} options.isAllDay - Whether the event is an all-day event.
 * @param {Object} options.dates - An object containing the following properties:
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @return {Promise} A promise that resolves to the result of adding the event to the calendar.
 */
async function registerEvent({ assignable, classes, id, isAllDay, dates, ctx }) {
  const calendarClasses = await ctx.tx.call('calendar.calendar.getCalendarsByClass', {
    classe: classes,
  });

  return ctx.tx.call('calendar.calendar.addEvent', {
    key: map(classes, (classe) => `calendar.class.${classe}`),
    data: {
      title: assignable.asset.name,
      isPrivate: true,
      isAllDay,
      type: 'calendar.task',
      startDate: getDate(dates.deadline), // typeof dates.start === 'string' ? dates.start : dates.start.toISOString(),
      endDate: getDate(dates.deadline),
      data: {
        instanceId: id,
        classes: map(calendarClasses, 'calendar'),
        hideInCalendar: !dates.deadline,
      },
    },
  });
}

module.exports = { registerEvent };
