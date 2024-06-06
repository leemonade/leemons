const _ = require('lodash');
const { getItemPermissionsCacheKey } = require('../../helpers/cacheKeys');

async function getItemPermissions({ item, type, returnRaw, ctx }) {
  const items = _.isArray(item) ? item : [item];

  let results = [];
  const query = { item: items, type };

  const cacheKey = getItemPermissionsCacheKey({ ctx, query });
  const cache = await ctx.cache.get(cacheKey);

  if (cache) {
    results = cache;
  } else {
    results = await ctx.tx.db.ItemPermissions.find(query).lean();
    await ctx.cache.set(cacheKey, results, 60 * 30); // 30 minutos
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
