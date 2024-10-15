const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { getPermissionConfig } = require('../calendar/getPermissionConfig');

const { add } = require('./add');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');
const { grantAccessUserAgentToEvent } = require('./grantAccessUserAgentToEvent');

/**
 * Add event to calendar if the user have access
 * @public
 * @static
 * @param {string} userSession - User session
 * @param {any} data - Event data
 * @param {string} ownerUserAgentId - Owner user agent Id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addFromUser({ data, ownerUserAgentId, ctx }) {
  const { userSession } = ctx.meta;

  let ownerUserAgent;
  if (ownerUserAgentId) {
    [ownerUserAgent] = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: [ownerUserAgentId],
    });
  }

  const userAgents = [ownerUserAgent ?? userSession.userAgents].flat();
  const permissionConfig = getPermissionConfig(data.calendar);
  const [userPermission] = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userAgents,
    query: {
      permissionName: permissionConfig.permissionName,
    },
  });

  if (userPermission?.actionNames?.indexOf('owner') < 0) {
    throw new LeemonsError(ctx, { message: 'Only the owner, can add events to this calendar' });
  }

  const { calendar, ...eventData } = data;

  const event = await add({ key: calendar, data: eventData, ctx });
  const permissionConfigEvent = getPermissionConfigEvent(event.id);

  await grantAccessUserAgentToEvent({
    id: event.id,
    userAgentId: _.map(userAgents, 'id'),
    actionName: permissionConfigEvent.all.actionNames,
    ctx,
  });

  if (eventData?.users) {
    await grantAccessUserAgentToEvent({
      id: event.id,
      userAgentId: eventData.users,
      actionName: ['view'],
      ctx,
    });
  }

  return event;
}

module.exports = { addFromUser };
