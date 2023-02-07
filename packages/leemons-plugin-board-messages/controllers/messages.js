const messagesService = require('../src/services/messages');

async function list(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size } = ctx.request.query;
    const data = await messagesService.list(parseInt(page, 10), parseInt(size, 10), {
      filters: ctx.request.body.filters,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  list,
};
