const _ = require('lodash');
const { table } = require('../tables');
const {
  getPermissionConfig: getPermissionConfigCalendar,
} = require('../calendar/getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { detail: detailEvent } = require('./detail');
const { getEventCalendars } = require('./getEventCalendars');

async function updateEventSubTasksFromUser(
  { id, subtask },
  userSession,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const userPlugin = leemons.getPlugin('users');

      const [event, calendars] = await Promise.all([detailEvent(id), getEventCalendars(id)]);

      const permissionConfigCalendars = _.map(calendars, (calendar) =>
        getPermissionConfigCalendar(calendar.key)
      );
      const permissionConfigEvent = getPermissionConfigEvent(event.id);

      const [calendarPermissions, [eventPermission]] = await Promise.all([
        await Promise.all(
          _.map(permissionConfigCalendars, (permissionConfigCalendar) =>
            userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
              query: {
                permissionName: permissionConfigCalendar.permissionName,
              },
              transacting,
            })
          )
        ),
        userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
          query: {
            permissionName: permissionConfigEvent.permissionName,
          },
          transacting,
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

        return table.events.update({ id }, { data: JSON.stringify(data) }, { transacting });
      }

      throw new Error('You can`t update this event');
    },
    table.calendars,
    _transacting
  );
}

module.exports = { updateEventSubTasksFromUser };
