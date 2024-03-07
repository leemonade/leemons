const _ = require('lodash');

async function getData({ ctx }) {
  const [{ compileJsonSchema, compileJsonUI }, value] = await Promise.all([
    ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
      locationName: 'user-data',
      pluginName: 'users',
      locale: ctx.meta.userSession.locale,
    }),
    ctx.tx.call('dataset.dataset.getValues', {
      locationName: 'user-data',
      pluginName: 'users',
      userAgent: ctx.meta.userSession.userAgents,
      target: ctx.meta.userSession.userAgents[0].id,
    }),
  ]);

  return { jsonSchema: compileJsonSchema, jsonUI: compileJsonUI, value };
}

async function getDataForUserAgentDatasets({ ctx }) {
  return Promise.all(
    _.map(ctx.meta.userSession.userAgents, async (userAgent) => {
      const data = await getData({
        ctx: {
          ...ctx,
          meta: {
            ...ctx.meta,
            userSession: {
              ...ctx.meta.userSession,
              userAgents: [userAgent],
            },
          },
        },
      });

      return {
        userAgent,
        data,
      };
    })
  );
}

module.exports = { getDataForUserAgentDatasets };
