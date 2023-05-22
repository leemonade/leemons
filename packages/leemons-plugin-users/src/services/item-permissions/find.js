const _ = require('lodash');
const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function find(params, { transacting } = {}) {
  const cacheKey = `users:permissions:find:${JSON.stringify(params)}`;
  const cache = await leemons.cache.get(cacheKey);
  if (cache) return cache;

  const results = await table.itemPermissions.find(params, { transacting });
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

  await leemons.cache.set(cacheKey, responses, 60 * 30); // 30 minutos

  return responses;
}

module.exports = { find };
