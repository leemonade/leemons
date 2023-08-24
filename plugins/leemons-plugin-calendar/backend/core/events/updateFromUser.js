const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const {
  getPermissionConfig: getPermissionConfigCalendar,
} = require('../calendar/getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { detail: detailEvent } = require('./detail');
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
async function updateFromUser({ id, data, ctx }) {
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
    let calendar = data.calendar || null;
    if (calendar) {
      const c = await Promise.all(
        _.map(_.isArray(calendar) ? calendar : [calendar], (k) => detailByKey({ key: k, ctx }))
      );
      calendar = _.map(c, 'id');
    }

    if (data?.users) {
      await unGrantAccessEventUsers({ id, ctx });
      /*
      _.forEach(userSession.userAgents, ({ id: uId }) => {
        if (data.users.includes(uId)) {
          data.users.splice(data.users.indexOf(uId), 1);
        }
      });
       */
      await grantAccessUserAgentToEvent({ id, userAgentId: data.users, actionName: ['view'], ctx });
    }

    if (data.data?.instanceId) {
      throw new LeemonsError(ctx, { message: 'Instance events can not be updated' });
    }

    const { users: __, calendar: ___, ...dat } = data;
    return update({ id: event.id, data: dat, calendar, ctx });
  }

  throw new LeemonsError(ctx, { message: 'You can`t update this event' });
}

module.exports = { updateFromUser };
