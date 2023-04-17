const _ = require('lodash');
const { table } = require('../tables');

async function getItemPermissions(item, type, { returnRaw, transacting } = {}) {
  const items = _.isArray(item) ? item : [item];

  let results = [];
  const query = { item_$in: items, type };

  const cacheKey = `users:permissions:getItemPermissions:${JSON.stringify(query)}`;
  const cache = await leemons.cache.get(cacheKey);

  if (cache) {
    results = cache;
  } else {
    results = await table.itemPermissions.find(query, { transacting });
    await leemons.cache.set(cacheKey, results, 60 * 30); // 30 minutos
  }

  if (returnRaw) {
    return results;
  }

  const permissions = {};
  _.forEach(results, (result) => {
    if (!permissions[result.permissionName]) {
      permissions[result.permissionName] = {
        permissionName: result.permissionName,
        actionNames: [],
      };
    }
    permissions[result.permissionName].actionNames.push(result.actionName);
  });

  return Object.values(permissions);
}

module.exports = { getItemPermissions };
