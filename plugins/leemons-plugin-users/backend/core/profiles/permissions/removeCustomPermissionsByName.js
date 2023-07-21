const _ = require('lodash');
const getProfileRole = require('../getProfileRole');
const { removePermissionsByName } = require('../../roles/permissions/removePermissionsByName');

const { validatePermissionName } = require('../../../validations/exists');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./markAllUsersWithProfileToReloadPermissions');

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} profileId - Profile id
 * @param {string[] | string} _permissions - Array of permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function removeCustomPermissionsByName({ profileId, permissions: _permissions, ctx }) {
  let permissions = _permissions;
  if (!_.isArray(permissions)) permissions = [permissions];
  _.forEach(permissions, (permission) => {
    validatePermissionName(permission, ctx.callerPlugin);
  });
  const role = await getProfileRole({ profileId, ctx });

  await Promise.all([
    ctx.tx.call('users.roles.removePermissionsByName', {
      roleId: role,
      permissions,
      removeCustomPermissions: true,
    }),
    markAllUsersWithProfileToReloadPermissions({ profileId, ctx }),
  ]);

  return true;
}

module.exports = { removeCustomPermissionsByName };
