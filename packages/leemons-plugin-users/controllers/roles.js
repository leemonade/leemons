const rolesService = require('../src/services/roles');

async function create(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      name: { type: 'string' },
      permissions: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['name'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const role = await rolesService.createRole(ctx.request.body.name, ctx.request.body.permissions);
    ctx.status = 201;
    ctx.body = { status: 201, role };
  } else {
    throw new Error(validator.error);
  }
}

async function list(ctx) {
  try {
    const validator = new global.utils.LeemonsValidator({
      type: 'object',
      properties: {
        name: { type: 'string' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name'],
      additionalProperties: false,
    });
    if (validator.validate(ctx.request.body)) {
      const role = await rolesService.createRole(
        ctx.request.body.name,
        ctx.request.body.permissions
      );
      ctx.status = 201;
      ctx.body = { status: 201, role };
    } else {
      throw new Error(validator.error);
    }
  } catch (err) {
    global.utils.returnError(ctx, err);
  }
}

module.exports = {
  create,
  list,
};
