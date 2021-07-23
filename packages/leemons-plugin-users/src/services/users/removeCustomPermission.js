const _ = require('lodash');
const hasPermission = require('./hasPermission');
const { validateUserRemoveCustomPermission } = require('../../validations/permissions');
const { existUserAuth } = require('./existUserAuth');
const { validatePermissionName } = require('../../validations/exists');
const { validateExistPermission } = require('../../validations/exists');
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
async function removeCustomPermission(userAuthId, data, { transacting } = {}) {
  validatePermissionName(data.permissionName, this.calledFrom);
  validateUserRemoveCustomPermission(data);

  if (_.isArray(userAuthId)) {
    return global.utils.settledResponseToManyResponse(
      await Promise.allSettled(
        _.map(userAuthId, (id) => _removeCustomPermission(id, data, { transacting }))
      )
    );
  } else {
    return _removeCustomPermission(userAuthId, data, { transacting });
  }
}

async function _removeCustomPermission(userAuthId, data, { transacting } = {}) {
  await existUserAuth({ id: userAuthId }, { transacting });
  await validateExistPermission(data.permissionName, { transacting });

  const query = {
    permissionName: data.permissionName,
    target: data.target || null,
    userAuth: userAuthId,
    role_$null: true,
  };

  if (data.actionNames) query.actionName_$in = data.actionNames;

  await table.userAuthPermission.deleteMany(query, { transacting });

  return true;
}

module.exports = removeCustomPermission;
