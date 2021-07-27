const _ = require('lodash');
const { table } = require('../tables');
const { updateUserAgentPermissions } = require('./updateUserAgentPermissions');
const constants = require('../../../config/constants');

/**
 * Return all user auth permissions
 * @public
 * @static
 * @param {UserAgent} userAgent - User auth
 * @param {object} _query
 * @param {any=} transacting - DB Transaction
 * @return {Promise<ListOfUserPermissions>} User permissions
 * */
async function getUserPermissions(userAgent, { query: _query, transacting } = {}) {
  const users = _.isArray(userAgent) ? userAgent : [userAgent];

  const reloadPermissionPromises = [];
  _.forEach(users, (user) => {
    if (user.reloadPermissions)
      reloadPermissionPromises.push(updateUserAgentPermissions(user.id, { transacting }));
  });

  await Promise.all(reloadPermissionPromises);

  const query = { ..._query, userAgent_$in: _.map(users, 'id') };

  const results = await table.userAgentPermission.find(query, { transacting });

  const group = _.groupBy(
    results,
    (value) => `${value.permissionName}.${value.target}.${value.role}`
  );

  const responses = [];
  _.forIn(group, (values) => {
    responses.push({
      ...values[0],
      actionNames: _.map(values, 'actionName'),
    });
  });

  // Add default permission for all users
  if (!_query) {
    responses.push({
      permissionName: constants.basicPermission.permissionName,
      actionNames: [constants.basicPermission.actionName],
      role: null,
      target: null,
      center: null,
    });
  }

  return responses;
}

module.exports = getUserPermissions;
