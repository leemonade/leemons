const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { find } = require('../../item-permissions/find');

async function getAllItemsForTheUserAgentHasPermissions(
  _userAgentId,
  { returnAllItemPermission, transacting } = {}
) {
  const query = await getBaseAllPermissionsQuery(_userAgentId, { transacting });

  const _userAgents = _.isArray(_userAgentId) ? _userAgentId : [_userAgentId];

  const cacheKeys = _.map(
    _userAgents,
    (_userAgent) =>
      `users:permissions:${_userAgent}:getAllItemsForTheUserAgentHasPermissions:${JSON.stringify(
        query
      )}`
  );
  const cache = await leemons.cache.getMany(cacheKeys);

  if (Object.keys(cache).length) {
    if (returnAllItemPermission) {
      return cache[Object.keys(cache)[0]];
    }
    return _.uniq(_.map(cache[Object.keys(cache)[0]], 'item'));
  }

  const items = await find(query, {
    transacting,
  });

  await Promise.all(
    _.map(
      cacheKeys,
      (key) => leemons.cache.set(key, items, 86400) // 1 dia
    )
  );

  if (returnAllItemPermission) return items;

  return _.uniq(_.map(items, 'item'));
}

module.exports = {
  getAllItemsForTheUserAgentHasPermissions,
};
