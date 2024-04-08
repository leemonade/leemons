/* eslint-disable camelcase */
const _ = require('lodash');
const constants = require('../../../config/constants');
const { updateUserAgentPermissions } = require('./updateUserAgentPermissions');
const { getUserAgentPermissionsCacheKey } = require('../../../helpers/cacheKeys');

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
  if (_.isArray(_query?.$or) && !_query.$or.length) {
    return [];
  }
  const _userAgents = _.isArray(userAgent) ? userAgent : [userAgent];

  const reloadUserAgents = [];
  _.forEach(_userAgents, (_userAgent) => {
    if (_userAgent.reloadPermissions) reloadUserAgents.push(_userAgent.id);
  });

  if (reloadUserAgents.length) {
    await updateUserAgentPermissions({ userAgentIds: reloadUserAgents, ctx });
  }

  const cacheKeys = _.map(_userAgents, (_userAgent) =>
    getUserAgentPermissionsCacheKey({ ctx, userAgent: _userAgent?.id ?? _userAgent, query: _query })
  );
  const cache = await ctx.cache.getMany(cacheKeys);

  if (Object.keys(cache).length) {
    return Object.keys(cache).reduce((acc, key) => [...acc, ...cache[key]], []);
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
    }) => JSON.stringify(rest)
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
  _.map(_userAgents, (_userAgent, index) => {
    const userAgentId = _userAgent.id;

    const permissions = _.filter(
      responses,
      (response) => !response.userAgent || response.userAgent === userAgentId
    ).map((_response) => {
      const response = _.cloneDeep(_response);

      response.actionNames = _.uniq(response.actionNames);
      delete response.actionName;
      delete response.userAgent;
      delete response.created_at;
      delete response.updated_at;
      delete response.createdAt;
      delete response.updatedAt;
      delete response._id;

      return response;
    });

    ctx.cache.set(cacheKeys[index], permissions, 86400);
  });

  responses.forEach((response) => {
    delete response.actionName;
    delete response.userAgent;
    delete response.created_at;
    delete response.updated_at;
    delete response.createdAt;
    delete response.updatedAt;
    delete response._id;
  });

  return responses;
}

module.exports = { getUserAgentPermissions };
