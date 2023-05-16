const _ = require('lodash');
const { validateNotExistEvent } = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');
const { unGrantAccessUserAgentToEvent } = require('./unGrantAccessUserAgentToEvent');

/**
 *
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function unGrantAccessEventUsers(id, { transacting } = {}) {
  await validateNotExistEvent(id, { transacting });

  const permissionConfig = getPermissionConfig(id);

  const [toRemove, notRemove] = await Promise.all([
    leemons.getPlugin('users').services.permissions.findUserAgentsWithPermission(
      {
        permissionName: permissionConfig.permissionName,
        actionNames: ['view'],
      },
      { transacting }
    ),
    leemons.getPlugin('users').services.permissions.findUserAgentsWithPermission(
      {
        permissionName: permissionConfig.permissionName,
        actionNames: ['owner'],
      },
      { transacting }
    ),
  ]);

  _.forEach(notRemove, (nr) => {
    if (toRemove.includes(nr)) {
      toRemove.splice(toRemove.indexOf(nr), 1);
    }
  });

  return unGrantAccessUserAgentToEvent(id, toRemove, { actionName: ['view'], transacting });
}

module.exports = { unGrantAccessEventUsers };
