/* eslint-disable camelcase */
const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { find } = require('../../item-permissions/find');
const {
  getAllItemsForTheUserAgentHasPermissionsByTypeCacheKey,
} = require('../../../helpers/cacheKeys');

async function getAllItemsForTheUserAgentHasPermissionsByType({
  userAgentId: _userAgentId,
  type: _type,
  target,
  ignoreOriginalTarget,
  returnAllItemPermission,
  type_$startssWith,
  item,
  ctx,
}) {
  const query = await getBaseAllPermissionsQuery({ userAgentId: _userAgentId, ctx });

  // eslint-disable-next-line camelcase
  if (type_$startssWith) {
    query.type = { $regex: `^${_.escapeRegExp(_type)}` };
  } else {
    query.type = _type;
  }

  if (ignoreOriginalTarget) {
    query.$or = _.map(query.$or, ({ target: t, ...q }) => q);
  }

  if (target) {
    const targetArr = _.isArray(target) ? target : [target];
    query.target = targetArr;
  }

  if (item) {
    const itemArr = _.isArray(item) ? item : [item];
    query.item = itemArr;
  }

  const _userAgents = _.isArray(_userAgentId) ? _userAgentId : [_userAgentId];

  const cacheKeys = _.map(_userAgents, (_userAgent) =>
    getAllItemsForTheUserAgentHasPermissionsByTypeCacheKey({
      ctx,
      userAgent: _userAgent?.id ?? _userAgent,
      query,
    })
  );
  const cache = await ctx.cache.getMany(cacheKeys);

  if (Object.keys(cache).length) {
    if (returnAllItemPermission) {
      return cache[Object.keys(cache)[0]];
    }
    return _.uniq(_.map(cache[Object.keys(cache)[0]], 'item'));
  }

  const items = await find({ params: query, ctx });

  await Promise.all(
    _.map(
      cacheKeys,
      (key) => ctx.cache.set(key, items, 86400) // 1 dia
    )
  );

  if (returnAllItemPermission) return items;

  return _.uniq(_.map(items, 'item'));
}

module.exports = {
  getAllItemsForTheUserAgentHasPermissionsByType,
};
