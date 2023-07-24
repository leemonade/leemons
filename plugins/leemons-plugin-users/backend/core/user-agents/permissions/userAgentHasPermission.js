const _ = require('lodash');
const constants = require('../../../config/constants');

/**
 * Check if user the permission
 * @public
 * @static
 * @param {string | string[]} userAgentId - User auth id
 * @param {UserHasCustomPermission} data - Has permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function userAgentHasPermission({ userAgentId, permissionName, actionNames, target, ctx }) {
  if (constants.basicPermission.permissionName === permissionName) {
    return actionNames.indexOf(constants.basicPermission.actionName) >= 0;
  }
  const query = {
    userAgent: _.isArray(userAgentId) ? userAgentId : [userAgentId],
    permissionName,
    actionName: actionNames,
  };
  if (target) query.target = target;
  const response = await ctx.tx.db.UserAgentPermission.countDocuments(query);
  return !!response;
}

module.exports = { userAgentHasPermission };
