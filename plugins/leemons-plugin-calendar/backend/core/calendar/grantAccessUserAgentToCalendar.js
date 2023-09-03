const _ = require('lodash');
const { validateNotExistCalendarKey, validateKeyPrefix } = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');

/**
 *
 * @public
 * @static
 * @param {string} key - key
 * @param {string|string[]} userAgentId - User agent id/s
 * @param {string|string[]} actionName - Action name/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function grantAccessUserAgentToCalendar({ key, userAgentId, actionName, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistCalendarKey({ key, ctx });

  const userAgentIds = _.isArray(userAgentId) ? userAgentId : [userAgentId];
  const actionNames = _.isArray(actionName) ? actionName : [actionName];
  const permissionConfig = getPermissionConfig(key);

  const { warnings } = await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgentId: userAgentIds,
    data: {
      permissionName: permissionConfig.permissionName,
      actionNames,
    },
  });

  console.log('warnings', warnings);

  if (warnings && warnings.errors && warnings.errors.length) throw warnings.errors[0];
  return true;
}

module.exports = { grantAccessUserAgentToCalendar };
