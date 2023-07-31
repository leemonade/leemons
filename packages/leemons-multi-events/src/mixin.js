/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { setKey, hasKeys, hasKey } = require('leemons-mongodb-helpers');

function getKey(str) {
  return `multi-events-${str}`;
}

async function markEventCalledAndCallIfCan({
  ctx,
  events,
  event,
  type,
  handler,
  ctxKeyValueModelName,
  params,
}) {
  const model = ctx.tx.db[ctxKeyValueModelName];
  if (!model)
    throw new LeemonsError(ctx, {
      message: '[leemons-multi-events] The key-value model you provide not found',
    });

  // ES: Seteamos que el evento a sido recibido
  await setKey(model, getKey(event));
  // ES: Comprobamos si ya han sido lanzados todos los eventos
  if (await hasKeys(model, _.map(events, getKey))) {
    // ES: Si el handler tiene que ser llamado solo una vez comprobamos si ya se llamo previamente y si no lo hizo lanzamos el handler
    if (type === 'once') {
      if (!(await hasKey(getKey(JSON.stringify(events))))) {
        await handler(ctx, ...params);
      }
    } else {
      // ES: Como se lanzaron todos los eventos lanzamos el handler
      await handler(ctx, ...params);
    }
    // ES: Siempre marcamos como que este evento ya se lanzo
    await setKey(model, getKey(JSON.stringify(events)));
  }
}

module.exports = ({ ctxKeyValueModelName = 'KeyValue' } = {}) => ({
  name: '',
  merged(schema) {
    _.forIn(schema.multiEvents, ({ events, type = 'once', handler }) => {
      _.forEach(events, (event) => {
        if (schema.events[event]) {
          if (_.isFunction(schema.events[event])) {
            const oldHandler = schema.events[event];
            schema.events[event] = async (ctx, ...params) => {
              markEventCalledAndCallIfCan({
                ctx,
                events,
                event,
                type,
                handler,
                ctxKeyValueModelName,
                params,
              });
              oldHandler(ctx, ...params);
            };
          } else {
            const oldHandler = schema.events[event].handler;
            schema.events[event].handler = async (ctx, ...params) => {
              markEventCalledAndCallIfCan({
                ctx,
                events,
                event,
                type,
                handler,
                ctxKeyValueModelName,
                params,
              });
              oldHandler(ctx, ...params);
            };
          }
        } else {
          schema.events[event] = {
            handler: async (ctx, ...params) => {
              markEventCalledAndCallIfCan({
                ctx,
                events,
                event,
                type,
                handler,
                ctxKeyValueModelName,
                params,
              });
            },
          };
        }
      });
    });
  },
});
