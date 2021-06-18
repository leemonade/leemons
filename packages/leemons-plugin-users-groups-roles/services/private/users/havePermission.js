const _ = require('lodash');
const { updateUserAuthPermissions } = require('./updateUserAuthPermissions');
const { isSuperAdmin } = require('./isSuperAdmin');
const { table } = require('../tables');

/**
 * Checks if the user has 1 or more of the specified permissions.
 * @public
 * @static
 * @param {UserAuth} userAuth - User auth to check
 * @param {Object} allowedPermissions - Allowed permission by key
 * @property {string[]} allowedPermissions.actions - Array of allowed actions
 * @property {string} allowedPermissions.target - Target
 * @param {any} ctx - Koa context
 * @return {Promise<boolean>} If have permission return true if not false
 * */
async function havePermission(userAuth, allowedPermissions, ctx) {
  if (userAuth.reloadPermissions) await updateUserAuthPermissions(userAuth.id);

  const promises = [];
  let query;
  _.forIn(allowedPermissions, (value, permissionName) => {
    query = { userAuth: userAuth.id, permission: permissionName, action_$in: value.actions };
    if (value.target) {
      query.target = value.target;
      if (ctx) query.target = _.get(ctx, value.target, value.target);
    }
    promises.push(table.userAuthPermission.count(query));
  });

  const values = await Promise.all(promises);

  let hasPermission = false;
  let i = 0;
  const maxIterations = values.length;

  while (i < maxIterations && !hasPermission) {
    if (values[i]) {
      hasPermission = true;
    }
    i++;
  }

  if (hasPermission) return true;
  hasPermission = await isSuperAdmin(userAuth.user);
  if (hasPermission) return true;
  return false;
}

module.exports = { havePermission };
