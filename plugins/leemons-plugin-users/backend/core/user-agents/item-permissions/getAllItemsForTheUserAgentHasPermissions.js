const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { find } = require('../../item-permissions/find');
const { getAllItemsForTheUserAgentHasPermissionsCacheKey } = require('../../../helpers/cacheKeys');

async function getAllItemsForTheUserAgentHasPermissions({
  userAgentId: _userAgentId,
  returnAllItemPermission,
  ctx,
}) {
  const query = await getBaseAllPermissionsQuery({ userAgentId: _userAgentId, ctx });

  const _userAgents = _.isArray(_userAgentId) ? _userAgentId : [_userAgentId];

  const cacheKeys = _.map(_userAgents, (_userAgent) =>
    getAllItemsForTheUserAgentHasPermissionsCacheKey({
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
  getAllItemsForTheUserAgentHasPermissions,
};
