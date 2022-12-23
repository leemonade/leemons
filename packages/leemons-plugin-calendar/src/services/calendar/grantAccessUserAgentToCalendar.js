const _ = require('lodash');
const { table } = require('../tables');
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
async function grantAccessUserAgentToCalendar(key, userAgentId, actionName, { transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  await validateNotExistCalendarKey(key, { transacting });

  const userAgentIds = _.isArray(userAgentId) ? userAgentId : [userAgentId];
  const actionNames = _.isArray(actionName) ? actionName : [actionName];
  const permissionConfig = getPermissionConfig(key);

  const { warnings } = await leemons
    .getPlugin('users')
    .services.permissions.addCustomPermissionToUserAgent(
      userAgentIds,
      {
        permissionName: permissionConfig.permissionName,
        actionNames,
      },
      { transacting }
    );

  if (warnings && warnings.errors && warnings.errors.length) throw warnings.errors[0];
  return true;
}

module.exports = { grantAccessUserAgentToCalendar };
