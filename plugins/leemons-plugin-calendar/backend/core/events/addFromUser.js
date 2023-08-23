const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getPermissionConfig } = require('../calendar/getPermissionConfig');
const { add } = require('./add');
const { grantAccessUserAgentToEvent } = require('./grantAccessUserAgentToEvent');
const { getPermissionConfig: getPermissionConfigEvent } = require('./getPermissionConfig');

/**
 * Add event to calendar if the user have access
 * @public
 * @static
 * @param {string} userSession - User session
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addFromUser({ data, ctx }) {
  const { userSession } = ctx.meta;
  const permissionConfig = getPermissionConfig(data.calendar);
  const [userPermission] = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userSession.userAgents,
    query: {
      permissionName: permissionConfig.permissionName,
    },
  });

  if (userPermission.actionNames.indexOf('owner') < 0) {
    throw new LeemonsError(ctx, { message: 'Only the owner, can add events to this calendar' });
  }

  const { calendar, ...eventData } = data;

  const event = await add({ key: calendar, data: eventData, ctx });
  const permissionConfigEvent = getPermissionConfigEvent(event.id);

  await grantAccessUserAgentToEvent({
    id: event.id,
    userAgentId: _.map(userSession.userAgents, 'id'),
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
