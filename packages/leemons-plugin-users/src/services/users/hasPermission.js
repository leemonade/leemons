const _ = require('lodash');
const { table } = require('../tables');
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
async function hasPermission(
  userAgentId,
  { permissionName, actionNames, target },
  { transacting } = {}
) {
  if (constants.basicPermission.permissionName === permissionName) {
    return actionNames.indexOf(constants.basicPermission.actionName) >= 0;
  }
  const query = {
    userAgent: userAgentId,
    permissionName,
    actionName_$in: actionNames,
  };
  if (target) query.target = target;
  const response = await table.userAgentPermission.count(query, { transacting });
  return !!response;
}

module.exports = hasPermission;
