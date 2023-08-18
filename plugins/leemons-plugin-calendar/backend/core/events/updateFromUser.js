const _ = require('lodash');
const { table } = require('../tables');
const {
  getPermissionConfig: getPermissionConfigCalendar,
} = require('../calendar/getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { detail: detailEvent } = require('./detail');
const { detail: detailCalendar } = require('../calendar/detail');
const { update } = require('./update');
const { getEventCalendars } = require('./getEventCalendars');
const { detailByKey } = require('../calendar/detailByKey');
const { grantAccessUserAgentToEvent } = require('./grantAccessUserAgentToEvent');
const { unGrantAccessEventUsers } = require('./unGrantAccessEventUsers');

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
        let calendar = data.calendar || null;
        if (calendar) {
          const c = await Promise.all(
            _.map(_.isArray(calendar) ? calendar : [calendar], (k) =>
              detailByKey(k, { transacting })
            )
          );
          calendar = _.map(c, 'id');
        }

        if (data?.users) {
          await unGrantAccessEventUsers(id, { transacting });
          /*
          _.forEach(userSession.userAgents, ({ id: uId }) => {
            if (data.users.includes(uId)) {
              data.users.splice(data.users.indexOf(uId), 1);
            }
          });
           */
          await grantAccessUserAgentToEvent(id, data.users, ['view'], { transacting });
        }

        if (data.data?.instanceId) {
          throw new Error('Instance events can not be updated');
        }

        delete data.users;
        delete data.calendar;
        return update(event.id, data, { calendar, transacting });
      }

      throw new Error('You can`t update this event');
    },
    table.calendars,
    _transacting
  );
}

module.exports = { updateFromUser };
