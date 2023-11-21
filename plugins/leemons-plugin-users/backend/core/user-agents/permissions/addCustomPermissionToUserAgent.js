const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { settledResponseToManyResponse } = require('@leemons/utils');
const { existUserAgent } = require('../existUserAgent');
const { validatePermissionName } = require('../../../validations/exists');
const { validateUserAddCustomPermission } = require('../../../validations/permissions');
const { userAgentHasCustomPermission } = require('./userAgentHasCustomPermission');
const { removeAllItemsCache } = require('../../item-permissions/removeAllItemsCache');

async function _addCustomPermissionToUserAgent({ userAgentId, data, throwIfExists = true, ctx }) {
  await existUserAgent({ query: { id: userAgentId }, throwErrorIfNotExists: false, ctx });
  const hasPermissions = _.uniq(
    await Promise.all(_.map(data, (d) => userAgentHasCustomPermission({ ...d, userAgentId, ctx })))
  );
  if (hasPermissions.length > 1 || hasPermissions[0]) {
    if (throwIfExists) {
      throw new LeemonsError(ctx, {
        message: `You have already been assigned this custom permit  ${JSON.stringify(data)}`,
      });
    } else {
      return null;
    }
  }

  const dataToCreate = [];
  _.forEach(data, ({ actionNames, ...d }) => {
    _.forEach(actionNames, (actionName) => {
      dataToCreate.push({
        ...d,
        actionName,
        userAgent: userAgentId,
      });
    });
  });

  return ctx.tx.db.UserAgentPermission.insertMany(dataToCreate);
}

/**
 * Add a user to platform
 * @public
 * @static
 * @param {string || string[]} userAgentId - User auth id
 * @param {UserAddCustomPermission || UserAddCustomPermission[]} data - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 *
 * @example
 *
 *
 * leemons
 * .getPlugin('users')
 * .services.permissions.addCustomPermissionToUserAgent(
 * 'userAgentId',
 * {
 *    permissionName: 'classroom.level',
 *    actionNames: ['admin'],
 *    target: level,
 * });
 *
 * */
async function addCustomPermissionToUserAgent({ userAgentId, data, throwIfExists = true, ctx }) {
  const _data = _.isArray(data) ? data : [data];
  _.forEach(_data, (d) => {
    validatePermissionName(d.permissionName, ctx.callerPlugin);
    validateUserAddCustomPermission(d);
  });

  if (_.isArray(userAgentId)) {
    const response = await settledResponseToManyResponse(
      await Promise.allSettled(
        _.map(userAgentId, (id) =>
          _addCustomPermissionToUserAgent({ userAgentId: id, data: _data, throwIfExists, ctx })
        )
      )
    );
    await removeAllItemsCache({ ctx });
    return response;
  }
  const response = await _addCustomPermissionToUserAgent({
    userAgentId,
    data: _data,
    throwIfExists,
    ctx,
  });
  await removeAllItemsCache({ ctx });
  return response;
}

module.exports = { addCustomPermissionToUserAgent };
