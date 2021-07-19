const _ = require('lodash');
const { table } = require('../tables');
const { updateUserAuthPermissions } = require('./updateUserAuthPermissions');
const constants = require('../../../config/constants');

/**
 * Return all user auth permissions
 * @public
 * @static
 * @param {UserAuth} userAuth - User auth
 * @param {any=} transacting - DB Transaction
 * @return {Promise<ListOfUserPermissions>} User permissions
 * */
async function getUserPermissions(userAuth, { transacting } = {}) {
  if (userAuth.reloadPermissions) await updateUserAuthPermissions(userAuth.id, { transacting });
  const results = await table.userAuthPermission.find({ userAuth: userAuth.id });

  const group = _.groupBy(
    results,
    (value) => `${value.permissionName}.${value.target}.${value.role}`
  );

  const responses = [];
  _.forIn(group, (values) => {
    responses.push({
      role: values[0].role,
      permissionName: values[0].permissionName,
      actionNames: _.map(values, 'actionName'),
      target: values[0].target,
    });
  });

  // Add default permission for all users
  responses.push({
    role: null,
    permissionName: constants.basicPermission.permissionName,
    actionNames: [constants.basicPermission.actionName],
    target: null,
  });

  return responses;
}

module.exports = getUserPermissions;
