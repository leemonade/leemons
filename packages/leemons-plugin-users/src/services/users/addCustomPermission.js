const _ = require('lodash');
const hasPermission = require('./hasPermission');
const hasCustomPermission = require('./hasCustomPermission');
const { existUserAuth } = require('./existUserAuth');
const { validatePermissionName } = require('../../validations/exists');
const { validateExistPermission } = require('../../validations/exists');
const { validateUserAddCustomPermission } = require('../../validations/permissions');
const { table } = require('../tables');

/**
 * Add a user to platform
 * @public
 * @static
 * @param {string} userAuthId - User auth id
 * @param {UserAddCustomPermission} data - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function addCustomPermission(userAuthId, data, { transacting } = {}) {
  validatePermissionName(data.permissionName, this.calledFrom);
  validateUserAddCustomPermission(data);

  if (_.isArray(userAuthId)) {
    return global.utils.settledResponseToManyResponse(
      await Promise.allSettled(
        _.map(userAuthId, (id) => _addCustomPermission(id, data, { transacting }))
      )
    );
  } else {
    return _addCustomPermission(userAuthId, data, { transacting });
  }
}

async function _addCustomPermission(userAuthId, data, { transacting } = {}) {
  await existUserAuth({ id: userAuthId }, { transacting });
  if (await hasCustomPermission(userAuthId, data, { transacting })) {
    throw new Error(`You have already been assigned this custom permit`);
  }

  await table.userAuthPermission.createMany(
    _.map(data.actionNames, (actionName) => ({
      permissionName: data.permissionName,
      actionName,
      target: data.target,
      userAuth: userAuthId,
      center: data.center,
    })),
    { transacting }
  );

  return { ...data, userAuth: userAuthId };
}

module.exports = addCustomPermission;
