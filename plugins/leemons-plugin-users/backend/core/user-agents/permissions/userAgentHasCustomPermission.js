const _ = require('lodash');
const constants = require('../../../config/constants');

/**
 * Check if user the permission
 * @public
 * @static
 * @param {string} userAgentId - User auth id
 * @param {UserHasCustomPermission} data - Has permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function userAgentHasCustomPermission({
  userAgentId,
  permissionName,
  actionNames,
  target,
  center,
  ctx,
}) {
  if (constants.basicPermission.permissionName === permissionName) {
    return actionNames.indexOf(constants.basicPermission.actionName) >= 0;
  }
  const query = {
    role: null,
    userAgent: _.isArray(userAgentId) ? userAgentId : [userAgentId],
    permissionName,
  };
  if (actionNames) query.actionName = actionNames;
  if (target) query.target = target;
  if (center) query.center = center;
  const response = await ctx.tx.db.UserAgentPermission.countDocuments(query);
  return !!response;
}

module.exports = { userAgentHasCustomPermission };
