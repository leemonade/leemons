const { map } = require('lodash');

const { registerEvent } = require('../calendar/registerEvent');

async function createEventAndAddToUsers({
  assignable,
  classes,
  id,
  dates,
  isAllDay,
  teachers,
  students,
  ctx,
}) {
  const { id: event } = await registerEvent({ assignable, classes, id, dates, isAllDay, ctx });

  // EN: Grant users to access event
  // ES: Da permiso a los usuarios para ver el evento
  if (event && teachers && teachers.length) {
    await ctx.tx.call('calendar.calendar.grantAccessUserAgentToEvent', {
      id: event,
      userAgentId: map(teachers, 'teacher'),
      actionName: 'view',
    });
  }

  if (students.length) {
    // EN: Grant users to access event
    // ES: Da permiso a los usuarios para ver el evento
    if (event) {
      await ctx.tx.call('calendar.calendar.grantAccessUserAgentToEvent', {
        id: event,
        userAgentId: students,
        actionName: 'view',
      });
    }
  }

  return event;
}

module.exports = { createEventAndAddToUsers };
