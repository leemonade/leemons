const _ = require('lodash');
const { exist } = require('../exist');
const { getRole } = require('../getRole');
const { validatePermissionName } = require('../../../validations/exists');
const { removePermissionsByName } = require('../../roles');
const {
  markAllUserAgentsForUserProfileToReloadPermissions,
} = require('./markAllUserAgentsForUserProfileToReloadPermissions');

/**
 *
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {string[] | string} _permissions - Array of permissions
 * @param {any} _transacting - DB transaction
 * @return {Promise<Permission>} Created permission
 * */
async function removeCustomPermissionToUserProfile({
  user,
  profile,
  permissions: _permissions,
  ctx,
}) {
  let permissions = _permissions;
  if (!_.isArray(permissions)) permissions = [permissions];
  _.forEach(permissions, (permission) => {
    validatePermissionName(permission, ctx.callerPlugin);
  });

  const exists = await exist({ user, profile, ctx });
  if (!exists) return true;

  const role = await getRole({ user, profile, ctx });

  await Promise.all([
    removePermissionsByName({
      roleId: role,
      permissionNames: permissions,
      removeCustomPermissions: true,
      ctx,
    }),
    markAllUserAgentsForUserProfileToReloadPermissions({ user, profile, ctx }),
  ]);

  return true;
}

module.exports = { removeCustomPermissionToUserProfile };
