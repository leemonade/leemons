import type { Context, ServiceSchema } from '@leemons/moleculer';
import { getActionNameFromCTX } from '@leemons/service-name-parser';
import _ from 'lodash';
import type { Service } from 'moleculer';
import type { LeemonsMiddleware } from './types';

interface ActionSchema {
  middlewares?: LeemonsMiddleware | LeemonsMiddleware[];
  [key: string]: any;
}

export const LeemonsMiddlewaresMixin = (): ServiceSchema => ({
  name: '',
  hooks: {
    before: {
      '*': [
        async function (this: Service, ctx: Context) {
          const action = (this.schema.actions as Record<string, ActionSchema>)[
            getActionNameFromCTX(ctx)
          ];
          if (_.isObject(action) && 'middlewares' in action) {
            const middlewares = [action.middlewares].flat();

            for (let i = 0, l = middlewares.length; i < l; i++) {
              if (_.isFunction(middlewares[i])) {
                await middlewares[i]!(ctx);
              }
            }
          }
        },
      ],
    },
  },
});
