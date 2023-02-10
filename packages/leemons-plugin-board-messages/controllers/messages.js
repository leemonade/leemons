const messagesService = require('../src/services/messages');

async function list(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      filters: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const { page, size } = ctx.request.body;
    const data = await messagesService.list(parseInt(page, 10), parseInt(size, 10), {
      userSession: ctx.state.userSession,
      filters: ctx.request.body.filters,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function save(ctx) {
  const message = await messagesService.save(ctx.request.body, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, message };
}

module.exports = {
  list,
  save,
};
