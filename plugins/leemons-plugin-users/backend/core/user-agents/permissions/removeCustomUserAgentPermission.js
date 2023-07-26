const _ = require('lodash');
const { settledResponseToManyResponse } = require('leemons-utils');
const { validateUserRemoveCustomPermission } = require('../../../validations/permissions');
const { existUserAgent } = require('../existUserAgent');
const { validatePermissionName } = require('../../../validations/exists');
const { removeAllItemsCache } = require('../../item-permissions/removeAllItemsCache');

async function _removeCustomPermission({ userAgentId, data, ctx }) {
  await existUserAgent({ query: { id: userAgentId }, throwErrorIfNotExists: true, ctx });

  const query = {
    permissionName: data.permissionName,
    userAgent: userAgentId,
    role: null,
  };

  if (data.target !== undefined) {
    query.target = data.target;
  }

  if (data.center !== undefined) {
    query.center = data.center;
  }

  if (data.actionNames) query.actionName = data.actionNames;

  await ctx.tx.db.UserAgentPermission.deleteMany(query);

  return true;
}

/**
 * Remove permissions from userAgent
 * @public
 * @static
 * @param {string} userAgentId - User auth id
 * @param {UserAddCustomPermission} data - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 *
 * @example
 * leemons
 * .getPlugin('users')
 * .services.permissions.removeCustomUserAgentPermission(
 * 'userAgentId',
 * {
 *    permissionName: 'classroom.level'
 * });
 * */
async function removeCustomUserAgentPermission({ userAgentId, data, ctx }) {
  validatePermissionName(data.permissionName, ctx.callerPlugin);
  validateUserRemoveCustomPermission(data);

  // console.log(userAgentId, data);

  if (_.isArray(userAgentId)) {
    const response = await settledResponseToManyResponse(
      await Promise.allSettled(
        _.map(userAgentId, (id) => _removeCustomPermission({ userAgentId: id, data, ctx }))
      )
    );
    await removeAllItemsCache({ ctx });
    return response;
  }
  const response = await _removeCustomPermission({ userAgentId, data, ctx });
  await removeAllItemsCache({ ctx });
  return response;
}

module.exports = { removeCustomUserAgentPermission };
