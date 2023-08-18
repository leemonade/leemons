const { LeemonsError } = require('leemons-error');

function getModel({ ctxKeyValueModelName, ctx }) {
  const model = ctx.tx.db[ctxKeyValueModelName];
  if (!model)
    throw new LeemonsError(ctx, {
      message: `[leemons-providers] ctx KeyValue model not found (${ctxKeyValueModelName})`,
    });
  return model;
}

function getProvidersActions({ ctxKeyValueModelName = 'KeyValue' } = {}) {
  return {
    register: {
      handler: async (ctx) => {
        const model = getModel({ ctx, ctxKeyValueModelName });
        await model.updateOne(
          { key: '_providers_', 'value.pluginName': ctx.callerPlugin },
          {
            key: '_providers_',
            value: { pluginName: ctx.callerPlugin, params: ctx.params },
          },
          { upsert: true }
        );
        return true;
      },
    },
    unregister: {
      handler: async (ctx) => {
        const model = getModel({ ctx, ctxKeyValueModelName });
        await model.deleteOne({ key: '_providers_', 'value.pluginName': ctx.callerPlugin });
        return true;
      },
    },
  };
}

module.exports = { getProvidersActions };
