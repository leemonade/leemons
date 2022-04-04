const _ = require('lodash');
const { table } = require('../../tables');
const constants = require('../../../../config/constants');

/**
 * Check if user the permission
 * @public
 * @static
 * @param {string} userAgentId - User auth id
 * @param {UserHasCustomPermission} data - Has permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function userAgentHasCustomPermission(
  userAgentId,
  { permissionName, actionNames, target, center },
  { transacting } = {}
) {
  if (constants.basicPermission.permissionName === permissionName) {
    return actionNames.indexOf(constants.basicPermission.actionName) >= 0;
  }
  const query = {
    role_$null: true,
    userAgent_$in: _.isArray(userAgentId) ? userAgentId : [userAgentId],
    permissionName,
  };
  if (actionNames) query.actionName_$in = actionNames;
  if (target) query.target = target;
  if (center) query.center = center;
  const response = await table.userAgentPermission.count(query, { transacting });
  return !!response;
}

module.exports = { userAgentHasCustomPermission };
