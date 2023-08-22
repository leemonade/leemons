/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { setTimeout } = require('timers/promises');
const { LeemonsError } = require('leemons-error');
const { setKey, hasKeys, hasKey, getKey } = require('leemons-mongodb-helpers');
const { randomString } = require('leemons-utils');

function getEventKey(str) {
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
  try {
    const model = ctx.tx.db[ctxKeyValueModelName];
    if (!model)
      throw new LeemonsError(ctx, {
        message: '[leemons-multi-events] The key-value model you provide not found',
      });

    if (type === 'once-per-install') {
      event = `${ctx.meta.initDeploymentProcessNumber}-${event}`;
      events = _.map(events, (e) => `${ctx.meta.initDeploymentProcessNumber}-${e}`);
    }

    // ES: Seteamos que el evento a sido recibido
    await setKey(model, getEventKey(event));
    // ES: Comprobamos si ya han sido lanzados todos los eventos
    if (await hasKeys(model, _.map(events, getEventKey))) {
      if (type === 'once-per-install') {
        // Genera
        const randomStr = randomString();
        await setKey(
          model,
          getEventKey(
            `${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(events)}-randomStr`
          ),
          randomStr
        );

        await setTimeout(100);

        const savedRandomStr = await getKey(
          model,
          getEventKey(`${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(events)}-randomStr`)
        );

        if (savedRandomStr === randomStr) {
          if (
            !(await hasKey(
              model,
              getEventKey(`${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(events)}`)
            ))
          ) {
            // ES: Siempre marcamos como que este evento ya se lanzo
            await setKey(
              model,
              getEventKey(`${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(events)}`)
            );
            await handler(ctx, ...params);
          }
        }
      } else if (type === 'once') {
        // ES: Si el handler tiene que ser llamado solo una vez comprobamos si ya se llamo previamente y si no lo hizo lanzamos el handler
        if (!(await hasKey(model, getEventKey(JSON.stringify(events))))) {
          // ES: Siempre marcamos como que este evento ya se lanzo
          await setKey(model, getEventKey(JSON.stringify(events)));
          await handler(ctx, ...params);
        }
      } else {
        // ES: Siempre marcamos como que este evento ya se lanzo
        await setKey(model, getEventKey(JSON.stringify(events)));
        // ES: Como se lanzaron todos los eventos lanzamos el handler
        await handler(ctx, ...params);
      }
    }
  } catch (err) {
    // Nothing
  }
}

module.exports = ({ ctxKeyValueModelName = 'KeyValue' } = {}) => ({
  name: '',
  merged(schema) {
    _.forIn(schema.multiEvents, ({ events, type = 'on', handler }) => {
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
