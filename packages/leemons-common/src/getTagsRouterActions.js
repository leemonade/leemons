const { LeemonsValidator } = require('leemons-validator');

async function getTagsRouterActions({ middlewares } = {}) {
  return {
    listTagsRest: {
      rest: {
        method: 'POST',
        path: '/list',
      },
      middlewares,
      async handler(ctx) {
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
          const data = await ctx.tx.call('common.tags.listTags', { page, size, query });
          return { status: 200, data };
        }
        ctx.meta.$statusCode = 400;
        return { status: 400, error: validator.error };
      },
    },
  };
}

module.exports = { getTagsRouterActions };
