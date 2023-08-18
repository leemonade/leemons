const _ = require('lodash');
const {
  updateUserAgentPermissions,
} = require('../user-agents/permissions/updateUserAgentPermissions');
const { isSuperAdmin } = require('./isSuperAdmin');
const constants = require('../../config/constants');

/**
 * Checks if the user has 1 or more of the specified permissions.
 * @public
 * @static
 * @param {Object} allowedPermissions - Allowed permission by key
 * @property {string[]} allowedPermissions.actions - Array of allowed actions
 * @property {string} allowedPermissions.target - Target
 * @param {any?} ctx - Moleculer context
 * @return {Promise<boolean>} If have permission return true if not false
 * */
async function hasPermissionCTX({ allowedPermissions, ctx }) {
  const { userSession } = ctx.meta;
  if (_.isArray(userSession.userAgents) && userSession.userAgents.length) {
    const reloadUserAgents = [];
    _.forEach(userSession.userAgents, (userAgent) => {
      if (userAgent.reloadPermissions) reloadUserAgents.push(userAgent.id);
    });

    if (reloadUserAgents.length) {
      await updateUserAgentPermissions({ userAgentIds: reloadUserAgents, ctx });
    }
  }

  const promises = [];
  let query;
  _.forIn(allowedPermissions, (value, permissionName) => {
    // We check the default permission of all users
    if (constants.basicPermission.permissionName === permissionName) {
      promises.push(value.actions.indexOf(constants.basicPermission.actionName) >= 0 ? 1 : 0);
    } else {
      query = {
        userAgent: _.map(userSession.userAgents, 'id'),
        permissionName,
        actionName: value.actions,
      };
      if (value.target) {
        query.target = value.target;
      }
      promises.push(ctx.tx.db.UserAgentPermission.countDocuments(query));
    }
  });

  const values = await Promise.all(promises);

  let _hasPermission = false;
  let i = 0;
  const maxIterations = values.length;

  while (i < maxIterations && !_hasPermission) {
    if (values[i]) {
      _hasPermission = true;
    }
    i++;
  }

  if (_hasPermission) return true;
  _hasPermission = await isSuperAdmin(userSession.id);
  if (_hasPermission) return true;
  return false;
}

module.exports = { hasPermissionCTX };
