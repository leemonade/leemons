const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const {
  getPermissionConfig: getPermissionConfigCalendar,
} = require('../calendar/getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { detail: detailEvent } = require('./detail');
const { getEventCalendars } = require('./getEventCalendars');

async function updateEventSubTasksFromUser({ id, subtask, ctx }) {
  const { userSession } = ctx.meta;

  const [event, calendars] = await Promise.all([
    detailEvent({ id, ctx }),
    getEventCalendars({ eventId: id, ctx }),
  ]);

  const permissionConfigCalendars = _.map(calendars, (calendar) =>
    getPermissionConfigCalendar(calendar.key)
  );
  const permissionConfigEvent = getPermissionConfigEvent(event.id);

  const [calendarPermissions, [eventPermission]] = await Promise.all([
    await Promise.all(
      _.map(permissionConfigCalendars, (permissionConfigCalendar) =>
        ctx.tx.call('users.permissions.getUserAgentPermissions', {
          userAgent: userSession.userAgents,
          query: {
            permissionName: permissionConfigCalendar.permissionName,
          },
        })
      )
    ),
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: userSession.userAgents,
      query: {
        permissionName: permissionConfigEvent.permissionName,
      },
    }),
  ]);

  let isOwnerCalendar = false;

  _.forEach(calendarPermissions, ([calendarPermission]) => {
    if (calendarPermission && calendarPermission.actionNames.indexOf('owner') >= 0) {
      isOwnerCalendar = true;
      return false;
    }
  });

  // ES: Por ahora cualquier persona con el evento puede actualizarlo
  if (
    isOwnerCalendar ||
    (eventPermission && eventPermission.actionNames.indexOf('owner') >= 0) ||
    (eventPermission && eventPermission.actionNames.indexOf('view') >= 0)
  ) {
    const { data } = event;
    data.subtask = subtask;

    return ctx.tx.db.Events.findOneAndUpdate(
      { id },
      { data: JSON.stringify(data) },
      { new: true, lean: true }
    );
  }

  throw new LeemonsError(ctx, { message: 'You can`t update this event' });
}

module.exports = { updateEventSubTasksFromUser };
