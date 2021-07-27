const _ = require('lodash');
const hasCustomPermission = require('./hasCustomPermission');
const { existUserAgent } = require('./existUserAgent');
const { validatePermissionName } = require('../../validations/exists');
const { validateUserAddCustomPermission } = require('../../validations/permissions');
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
async function addCustomPermission(userAgentId, data, { transacting } = {}) {
  validatePermissionName(data.permissionName, this.calledFrom);
  validateUserAddCustomPermission(data);

  if (_.isArray(userAgentId)) {
    return global.utils.settledResponseToManyResponse(
      await Promise.allSettled(
        _.map(userAgentId, (id) => _addCustomPermission(id, data, { transacting }))
      )
    );
  } else {
    return _addCustomPermission(userAgentId, data, { transacting });
  }
}

async function _addCustomPermission(userAgentId, data, { transacting } = {}) {
  await existUserAgent({ id: userAgentId }, { transacting });
  if (await hasCustomPermission(userAgentId, data, { transacting })) {
    throw new Error(`You have already been assigned this custom permit`);
  }

  await table.userAgentPermission.createMany(
    _.map(data.actionNames, (actionName) => ({
      permissionName: data.permissionName,
      actionName,
      target: data.target,
      userAgent: userAgentId,
      center: data.center,
    })),
    { transacting }
  );

  return { ...data, userAgent: userAgentId };
}

module.exports = addCustomPermission;
