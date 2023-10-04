const { map } = require('lodash');
const { updateEvent } = require('../calendar/updateEvent');
const { listInstanceClasses } = require('../../classes');

async function updateEventAndAddToUsers({ assignable, event, dates, id, ctx }) {
  const classes = map(await listInstanceClasses({ id, ctx }), 'class');

  try {
    if (event) {
      await updateEvent({ event, assignable, classes, dates, ctx });
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
