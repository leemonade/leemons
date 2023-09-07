/* eslint-disable camelcase */
const _ = require('lodash');
const constants = require('../../../config/constants');
const { updateUserAgentPermissions } = require('./updateUserAgentPermissions');

/**
 * Return all user auth permissions
 * @public
 * @static
 * @param {UserAgent} userAgent - User auth
 * @param {object} _query
 * @param {any=} transacting - DB Transaction
 * @return {Promise<ListOfUserPermissions>} User permissions
 * */
async function getUserAgentPermissions({ userAgent, query: _query, ctx }) {
  const _userAgents = _.isArray(userAgent) ? userAgent : [userAgent];

  const reloadUserAgents = [];
  _.forEach(_userAgents, (_userAgent) => {
    if (_userAgent.reloadPermissions) reloadUserAgents.push(_userAgent.id);
  });

  if (reloadUserAgents.length) {
    await updateUserAgentPermissions({ userAgentIds: reloadUserAgents, ctx });
  }

  const cacheKeys = _.map(
    _userAgents,
    (_userAgent) =>
      `users:permissions:${_userAgent.id}:getUserAgentPermissions:${JSON.stringify(_query)}`
  );
  const cache = await ctx.cache.getMany(cacheKeys);

  if (Object.keys(cache).length) {
    return cache[Object.keys(cache)[0]];
  }

  const query = { ..._query, userAgent: _.map(_userAgents, 'id') };

  const results = await ctx.tx.db.UserAgentPermission.find(query).lean();

  const group = _.groupBy(
    results,
    ({
      actionName,
      id,
      _id,
      userAgent: _ua,
      created_at,
      updated_at,
      createdAt,
      updatedAt,
      ...rest
    }) => {
      return JSON.stringify(rest);
    }
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

  _.map(responses, (response) => {
    response.actionNames = _.uniq(response.actionNames);
    delete response.actionName;
    delete response.userAgent;
    delete response.created_at;
    delete response.updated_at;
    delete response.createdAt;
    delete response.updatedAt;
    delete response._id;
  });

  await Promise.all(
    _.map(
      cacheKeys,
      (key) => ctx.cache.set(key, responses, 86400) // 1 dia
    )
  );

  return responses;
}

module.exports = { getUserAgentPermissions };
