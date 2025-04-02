import { LeemonsError } from '@leemons/error';
import { getKey, hasKey, hasKeys, setKey } from '@leemons/mongodb-helpers';
import { randomString } from '@leemons/utils';
import _ from 'lodash';
import { setTimeout } from 'timers/promises';
import type {
  MarkEventCalledParams,
  MultiEventConfig,
  MultiEventHandler,
  MultiEventsMixinOptions,
  MultiEventsSchema,
} from './types';

function getEventKey(str: string): string {
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
}: MarkEventCalledParams): Promise<void> {
  try {
    const model = ctx.tx.db[ctxKeyValueModelName];
    if (!model) {
      throw new LeemonsError(ctx, {
        message: '[leemons-multi-events] The key-value model you provide not found',
      });
    }

    let processedEvent = event;
    let processedEvents = events;

    if (type === 'once-per-install') {
      processedEvent = `${ctx.meta.initDeploymentProcessNumber}-${event}`;
      processedEvents = _.map(events, (e) => `${ctx.meta.initDeploymentProcessNumber}-${e}`);
    }

    // Set that the event has been received
    await setKey(model, getEventKey(processedEvent));
    // Check if all events have been triggered
    if (await hasKeys(model, _.map(processedEvents, getEventKey))) {
      if (type === 'once-per-install') {
        // Generate random string
        const randomStr = randomString();
        await setKey(
          model,
          getEventKey(
            `${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(processedEvents)}-randomStr`
          ),
          randomStr
        );

        await setTimeout(50);

        const savedRandomStr = await getKey(
          model,
          getEventKey(
            `${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(processedEvents)}-randomStr`
          )
        );

        if (savedRandomStr === randomStr) {
          if (
            !(await hasKey(
              model,
              getEventKey(
                `${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(processedEvents)}`
              )
            ))
          ) {
            // Mark this event as already triggered
            await setKey(
              model,
              getEventKey(
                `${ctx.meta.initDeploymentProcessNumber}-${JSON.stringify(processedEvents)}`
              )
            );
            await handler(ctx, ...params);
          }
        }
      } else if (type === 'once') {
        // If handler should be called only once, check if it was called before
        if (!(await hasKey(model, getEventKey(JSON.stringify(processedEvents))))) {
          // Mark this event as already triggered
          await setKey(model, getEventKey(JSON.stringify(processedEvents)));
          await handler(ctx, ...params);
        }
      } else {
        // Mark this event as already triggered
        await setKey(model, getEventKey(JSON.stringify(processedEvents)));
        // All events were triggered, call the handler
        await handler(ctx, ...params);
      }
    }
  } catch (err) {
    // Nothing
  }
}

export default function ({ ctxKeyValueModelName = 'KeyValue' }: MultiEventsMixinOptions = {}) {
  return {
    name: '',
    metadata: {
      mixins: {
        LeemonsMultiEventsMixin: true,
      },
    },
    events: {},
    merged(schema: MultiEventsSchema) {
      _.forIn(schema.multiEvents, ({ events, type = 'on', handler }: MultiEventConfig) => {
        _.forEach(events, (event) => {
          if (schema.events[event]) {
            if (_.isFunction(schema.events[event])) {
              const oldHandler = schema.events[event] as MultiEventHandler;
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
              const eventObj = schema.events[event] as {
                handler: MultiEventHandler;
              };
              const oldHandler = eventObj.handler;
              eventObj.handler = async (ctx, ...params) => {
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
  };
}
