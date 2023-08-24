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
async function unGrantAccessEventUsers({ id, ctx }) {
  await validateNotExistEvent({ id, ctx });

  const permissionConfig = getPermissionConfig(id);

  const [toRemove, notRemove] = await Promise.all([
    ctx.tx.call('users.permissions.findUserAgentsWithPermission', {
      permissions: {
        permissionName: permissionConfig.permissionName,
        actionNames: ['view'],
      },
    }),
    ctx.tx.call('users.permissions.findUserAgentsWithPermission', {
      permissions: {
        permissionName: permissionConfig.permissionName,
        actionNames: ['owner'],
      },
    }),
  ]);

  _.forEach(notRemove, (nr) => {
    if (toRemove.includes(nr)) {
      toRemove.splice(toRemove.indexOf(nr), 1);
    }
  });

  return unGrantAccessUserAgentToEvent({ id, userAgentId: toRemove, actionName: ['view'], ctx });
}

module.exports = { unGrantAccessEventUsers };
