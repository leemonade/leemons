const _ = require('lodash');
const hasPermission = require('./hasPermission');
const { validateUserRemoveCustomPermission } = require('../../validations/permissions');
const { existUserAgent } = require('./existUserAgent');
const { validatePermissionName } = require('../../validations/exists');
const { validateExistPermission } = require('../../validations/exists');
const { table } = require('../tables');

/**
 * Add a user to platform
 * @public
 * @static
 * @param {string} userAgentId - User auth id
 * @param {UserAddCustomPermission} data - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function removeCustomPermission(userAgentId, data, { transacting } = {}) {
  validatePermissionName(data.permissionName, this.calledFrom);
  validateUserRemoveCustomPermission(data);

  if (_.isArray(userAgentId)) {
    return global.utils.settledResponseToManyResponse(
      await Promise.allSettled(
        _.map(userAgentId, (id) => _removeCustomPermission(id, data, { transacting }))
      )
    );
  } else {
    return _removeCustomPermission(userAgentId, data, { transacting });
  }
}

async function _removeCustomPermission(userAgentId, data, { transacting } = {}) {
  await existUserAgent({ id: userAgentId }, { transacting });

  const query = {
    permissionName: data.permissionName,
    target: data.target || null,
    center: data.center || null,
    userAgent: userAgentId,
    role_$null: true,
  };

  if (data.actionNames) query.actionName_$in = data.actionNames;

  await table.userAgentPermission.deleteMany(query, { transacting });

  return true;
}

module.exports = removeCustomPermission;
