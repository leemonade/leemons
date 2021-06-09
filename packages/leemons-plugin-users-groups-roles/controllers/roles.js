const rolesService = require('../services/private/roles');

async function create(ctx) {
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
    ctx.status = 400;
    ctx.body = { status: 400, msg: err.message };
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
    ctx.status = 400;
    ctx.body = { status: 400, msg: err.message };
  }
}

module.exports = {
  create,
  list,
};
