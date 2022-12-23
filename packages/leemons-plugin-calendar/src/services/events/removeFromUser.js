const _ = require('lodash');
const { table } = require('../tables');
const {
  getPermissionConfig: getPermissionConfigCalendar,
} = require('../calendar/getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { detail: detailEvent } = require('./detail');
const { detail: detailCalendar } = require('../calendar/detail');
const { removeOrCancel } = require('./removeOrCancel');
const { unGrantAccessUserAgentToEvent } = require('./unGrantAccessUserAgentToEvent');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} id - id
 * @param {string} userSession - User session
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeFromUser(userSession, id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const userPlugin = leemons.getPlugin('users');

      /*
      const event = await detailEvent(id);
      const calendar = await detailCalendar(event.calendar);
      const permissionConfigCalendar = getPermissionConfigCalendar(calendar.key);
      */
      const permissionConfigEvent = getPermissionConfigEvent(id);

      const [[eventPermission], [calendarPermission]] = await Promise.all([
        userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
          query: {
            permissionName: permissionConfigEvent.permissionName,
          },
          transacting,
        }),
        [],
        /*
        userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
          query: {
            permissionName: permissionConfigCalendar.permissionName,
          },
          transacting,
        })
         */
      ]);

      // ES: Si el usuario es owner del calendario o del evento entonces procedemos a
      // borrar/cancelar el evento por que tiene permiso para hacerlo
      if (
        (calendarPermission && calendarPermission.actionNames.indexOf('owner') >= 0) ||
        (eventPermission && eventPermission.actionNames.indexOf('owner') >= 0)
      ) {
        return removeOrCancel(id, { forceDelete: true, transacting });
      }
      // ES: Si el usuario tiene permiso para ver el evento y quiere borrarlo, le quitamos el permiso
      if (eventPermission && eventPermission.actionNames.indexOf('view') >= 0) {
        return unGrantAccessUserAgentToEvent(id, _.map(userSession.userAgents, 'id'), {
          transacting,
        });
      }
      throw new Error('You can`t remove this event');
    },
    table.events,
    _transacting
  );
}

module.exports = { removeFromUser };
