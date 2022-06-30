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

async function listForCenter(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      center: { type: 'string' },
    },
    required: ['center'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.params)) {
    const roles = await rolesService.listForCenter(ctx.request.params.center);
    ctx.status = 200;
    ctx.body = { status: 200, roles };
  } else {
    throw validator.error;
  }
}

module.exports = {
  create,
  listForCenter,
};
