const centerService = require('../src/services/centers');

async function list(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: 'number' },
      size: { type: 'number' },
      withRoles: {
        anyOf: [
          { type: 'boolean' },
          {
            type: 'object',
            properties: { columns: { type: 'array', items: { type: 'string' } } },
          },
        ],
      },
      withLimits: { type: 'boolean' },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const { page, size, ...options } = ctx.request.body;
    const data = await centerService.list(page, size, { ...options });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function add(ctx) {
  const center = await centerService.add(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, center };
}

async function remove(ctx) {
  await centerService.remove(ctx.request.body.id, { soft: true });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

module.exports = {
  list,
  add,
  remove,
};
