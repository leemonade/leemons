const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { removeOrCancel } = require('./removeOrCancel');
const { unGrantAccessUserAgentToEvent } = require('./unGrantAccessUserAgentToEvent');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} id - id
 * @param {string} userSession - User session
 * @param {string} ownerUserAgentId - Owner user agent Id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeFromUser({ id, ownerUserAgentId, ctx }) {
  const { userSession } = ctx.meta;

  let ownerUserAgent;
  if (ownerUserAgentId) {
    [ownerUserAgent] = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: [ownerUserAgentId],
    });
  }

  const userAgents = [ownerUserAgent ?? userSession.userAgents].flat();

  /*
  const event = await detailEvent(id);
  const calendar = await detailCalendar(event.calendar);
  const permissionConfigCalendar = getPermissionConfigCalendar(calendar.key);
  */
  const permissionConfigEvent = getPermissionConfigEvent(id);

  const [[eventPermission], [calendarPermission]] = await Promise.all([
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: userAgents,
      query: {
        permissionName: permissionConfigEvent.permissionName,
      },
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
    return removeOrCancel({ id, forceDelete: true, ctx });
  }
  // ES: Si el usuario tiene permiso para ver el evento y quiere borrarlo, le quitamos el permiso
  if (eventPermission && eventPermission.actionNames.indexOf('view') >= 0) {
    return unGrantAccessUserAgentToEvent({
      id,
      userAgentId: _.map(userAgents, 'id'),
      ctx,
    });
  }
  throw new LeemonsError(ctx, { message: 'You can`t remove this event' });
}

module.exports = { removeFromUser };
