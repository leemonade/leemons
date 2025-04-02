import { LeemonsError } from '@leemons/error';
import type { Context } from '@leemons/moleculer';
import { LeemonsValidator } from '@leemons/validator';
interface TagsRouterParams {
  page: number;
  size: number;
  query?: Record<string, any>;
}

interface TagsRouterContext extends Context {
  params: TagsRouterParams;
}

interface TagsRouterConfig {
  middlewares?: any[];
}

export function getTagsRouterActions({ middlewares }: TagsRouterConfig = {}) {
  return {
    listTagsRest: {
      rest: {
        method: 'POST',
        path: '/list',
      },
      middlewares,
      async handler(ctx: TagsRouterContext) {
        const validator = new LeemonsValidator({
          type: 'object',
          properties: {
            page: { type: 'number' },
            size: { type: 'number' },
            query: { type: 'object', additionalProperties: true },
          },
          required: ['page', 'size'],
          additionalProperties: false,
        });
        if (validator.validate(ctx.params)) {
          const { page, size, query } = ctx.params;
          const data = await ctx.tx.call('common.tags.listTags', {
            page,
            size,
            query,
          });
          return { status: 200, data };
        }

        throw new LeemonsError(ctx, {
          message: validator.errorMessage,
          httpStatusCode: 400,
        });
      },
    },
  };
}
