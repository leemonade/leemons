const _ = require('lodash');
const { table } = require('../tables');
const {
  getPermissionConfig: getPermissionConfigCalendar,
} = require('../calendar/getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { detail: detailEvent } = require('./detail');
const { detail: detailCalendar } = require('../calendar/detail');
const { update } = require('./update');

/**
 * Add event to calendar if the user have access
 * @public
 * @static
 * @param {string} userSession - User session
 * @param {string} id - Event id
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function updateFromUser(userSession, id, data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const userPlugin = leemons.getPlugin('users');

      const event = await detailEvent(id);
      const calendar = await detailCalendar(event.calendar);

      const permissionConfigCalendar = getPermissionConfigCalendar(calendar.key);
      const permissionConfigEvent = getPermissionConfigEvent(event.id);

      const [[calendarPermission], [eventPermission]] = await Promise.all([
        userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
          query: {
            permissionName: permissionConfigCalendar.permissionName,
          },
          transacting,
        }),
        userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
          query: {
            permissionName: permissionConfigEvent.permissionName,
          },
          transacting,
        }),
      ]);

      // ES: Por ahora cualquier persona con el evento puede actualizarlo
      if (
        (calendarPermission && calendarPermission.actionNames.indexOf('owner') >= 0) ||
        (eventPermission && eventPermission.actionNames.indexOf('owner') >= 0) ||
        (eventPermission && eventPermission.actionNames.indexOf('view') >= 0)
      ) {
        return update(event.id, data, { transacting });
      }

      throw new Error('You can`t update this event');
    },
    table.calendars,
    _transacting
  );
}

module.exports = { updateFromUser };
