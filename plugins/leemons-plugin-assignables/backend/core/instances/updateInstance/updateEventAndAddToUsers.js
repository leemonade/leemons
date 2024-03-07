const { map } = require('lodash');
const { updateEvent } = require('../calendar/updateEvent');
const { listInstanceClasses } = require('../../classes');

/**
 * Update an event and add it to users.
 *
 * @param {Object} options - The options for updating the event and adding it to users.
 * @param {boolean} options.assignable - Flag indicating if the event is assignable.
 * @param {Object} options.event - The event object.
 * @param {Array} options.dates - The array of dates.
 * @param {string} options.id - The ID of the event.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 */
async function updateEventAndAddToUsers({ assignable, event, dates, id, ctx }) {
  const classes = map(await listInstanceClasses({ id, ctx }), 'class');

  try {
    if (event) {
      await updateEvent({ event, assignable, classes, dates, ctx, withTX: false });
    }
    // TODO: Create the event and add it to the users. Needs: Users assigned and teachers
    //  else {
    //   const { id: eventId } = await registerEvent(assignable, classes, {
    //     dates,
    //     transacting,
    //   });
    //   newEvent = eventId;
    //   await leemons
    //     .getPlugin('calendar')
    //     .services.calendar.grantAccessUserAgentToEvent(
    //       event,
    //       [...newTeacherIds, ...newStudentIds],
    //       'view',
    //       {
    //         transacting,
    //       }
    //     );
    // }
  } catch (e) {
    ctx.logger.error(`Error creating/updating event for assignable instance: ${e.message}`);
  }
}

module.exports = { updateEventAndAddToUsers };
