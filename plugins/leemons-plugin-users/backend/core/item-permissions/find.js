const _ = require('lodash');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function find({ params, ctx }) {
  const cacheKey = `users:permissions:find:${JSON.stringify(params)}`;
  const cache = await ctx.cache.get(cacheKey);
  if (cache) return cache;

  const results = await ctx.tx.db.ItemPermissions.find(params).lean();
  const group = _.groupBy(
    results,
    (value) => `${value.permissionName}.${value.target}.${value.type}.${value.item}.${value.center}`
  );
  const responses = [];
  _.forIn(group, (values) => {
    responses.push({
      permissionName: values[0].permissionName,
      actionNames: _.map(values, 'actionName'),
      target: values[0].target,
      type: values[0].type,
      item: values[0].item,
      center: values[0].center,
    });
  });

  await ctx.cache.set(cacheKey, responses, 60 * 30); // 30 minutos

  return responses;
}

module.exports = { find };
