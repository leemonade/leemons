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

  // Grant users to access event
  if (event && (teachers?.length || students?.length)) {
    const userAgentIds = [...map(teachers, 'teacher'), ...students].filter(Boolean);
    if (userAgentIds.length) {
      await ctx.tx.call('calendar.calendar.grantAccessUserAgentToEvent', {
        id: event,
        userAgentId: userAgentIds,
        actionName: 'view',
      });
    }
  }

  return event;
}

module.exports = { createEventAndAddToUsers };
