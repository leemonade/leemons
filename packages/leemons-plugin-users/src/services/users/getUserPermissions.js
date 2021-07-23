const _ = require('lodash');
const { table } = require('../tables');
const { updateUserAuthPermissions } = require('./updateUserAuthPermissions');
const constants = require('../../../config/constants');

/**
 * Return all user auth permissions
 * @public
 * @static
 * @param {UserAuth} userAuth - User auth
 * @param {object} _query
 * @param {any=} transacting - DB Transaction
 * @return {Promise<ListOfUserPermissions>} User permissions
 * */
async function getUserPermissions(userAuth, { query: _query, transacting } = {}) {
  const users = _.isArray(userAuth) ? userAuth : [userAuth];

  const reloadPermissionPromises = [];
  _.forEach(users, (user) => {
    if (user.reloadPermissions)
      reloadPermissionPromises.push(updateUserAuthPermissions(user.id, { transacting }));
  });

  await Promise.all(reloadPermissionPromises);

  const query = { ..._query, userAuth_$in: _.map(users, 'id') };

  const results = await table.userAuthPermission.find(query, { transacting });

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
  if (!_query) {
    responses.push({
      role: null,
      permissionName: constants.basicPermission.permissionName,
      actionNames: [constants.basicPermission.actionName],
      target: null,
    });
  }

  return responses;
}

module.exports = getUserPermissions;
