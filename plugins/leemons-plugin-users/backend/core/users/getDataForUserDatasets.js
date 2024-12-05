const _ = require('lodash');

async function getData({ locationName, userId, ctx }) {
  const promises = [
    ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
      locationName,
      pluginName: 'users',
      locale: ctx.meta.userSession.locale,
    }),
    ctx.tx.call('dataset.dataset.getValues', {
      locationName,
      pluginName: 'users',
      userAgent: ctx.meta.userSession.userAgents,
      target: userId,
    }),
  ];

  const [{ compileJsonSchema, compileJsonUI }, value] = await Promise.all(promises);

  return { jsonSchema: compileJsonSchema, jsonUI: compileJsonUI, value };
}

async function getDataForUserDatasets({ userIds, ctx }) {
  const locationName = 'user-data';

  return Promise.allSettled(
    _.map(userIds, async (userId) => {
      const data = await getData({
        locationName,
        userId,
        ctx,
      });

      return {
        userId,
        data,
        locationName,
      };
    })
  ).then((results) =>
    results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  );
}

module.exports = { getDataForUserDatasets };
