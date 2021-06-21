const profileService = require('../services/private/profiles');

async function list(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: 'number' },
      size: { type: 'number' },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const data = await profileService.list(ctx.request.body.page, ctx.request.body.size);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw new Error(validator.error);
  }
}

async function add(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      permissions: {
        type: 'object',
        patternProperties: {
          '.*': {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    required: ['name', 'description', 'permissions'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    console.log(ctx.request.body);

    ctx.status = 200;
    ctx.body = { status: 200 };
  } else {
    throw new Error(validator.error);
  }
}

module.exports = {
  list,
  add,
};
