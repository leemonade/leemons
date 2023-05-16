const _ = require('lodash');
const { validateNotExistEvent } = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');

/**
 *
 * @public
 * @static
 * @param {string} id - id
 * @param {string|string[]} userAgentId - User agent id/s
 * @param {string|string[]} actionName - Action name/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function unGrantAccessUserAgentToEvent(id, userAgentId, { actionName, transacting } = {}) {
  await validateNotExistEvent(id, { transacting });

  const userAgentIds = _.isArray(userAgentId) ? userAgentId : [userAgentId];
  const actionNames = _.isArray(actionName) ? actionName : [actionName];
  const permissionConfig = getPermissionConfig(id);

  const query = {
    permissionName: permissionConfig.permissionName,
  };

  if (actionName) {
    query.actionNames = actionNames;
  }

  const { warnings } = await leemons
    .getPlugin('users')
    .services.users.removeCustomUserAgentPermission(userAgentIds, query, { transacting });
  if (warnings && warnings.errors && warnings.errors.length) throw warnings.errors[0];
  return true;
}

module.exports = { unGrantAccessUserAgentToEvent };
