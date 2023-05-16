const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { find } = require('../../item-permissions/find');

async function getAllItemsForTheUserAgentHasPermissionsByType(
  _userAgentId,
  _type,
  // eslint-disable-next-line camelcase
  {
    target,
    ignoreOriginalTarget,
    returnAllItemPermission,
    type_$startssWith,
    transacting,
    item,
  } = {}
) {
  const query = await getBaseAllPermissionsQuery(_userAgentId, { transacting });

  // eslint-disable-next-line camelcase
  if (type_$startssWith) {
    query.type_$startssWith = _type;
  } else {
    query.type = _type;
  }

  if (ignoreOriginalTarget) {
    query.$or = _.map(query.$or, ({ target: t, ...q }) => q);
  }

  if (target) {
    const targetArr = _.isArray(target) ? target : [target];
    query.target_$in = targetArr;
  }

  if (item) {
    const itemArr = _.isArray(item) ? item : [item];
    query.item_$in = itemArr;
  }

  const _userAgents = _.isArray(_userAgentId) ? _userAgentId : [_userAgentId];

  const cacheKeys = _.map(
    _userAgents,
    (_userAgent) =>
      `users:permissions:${_userAgent}:getAllItemsForTheUserAgentHasPermissionsByType:${JSON.stringify(
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
  getAllItemsForTheUserAgentHasPermissionsByType,
};
