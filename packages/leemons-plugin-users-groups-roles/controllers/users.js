const usersService = require('../services/private/users');

async function canReset(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const can = await usersService.canReset(ctx.request.body.token);
    ctx.status = 200;
    ctx.body = { status: 200, can };
  } else {
    throw validator.error;
  }
}

async function reset(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      token: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['token', 'password'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const user = await usersService.reset(ctx.request.body.token, ctx.request.body.password);
    ctx.status = 200;
    ctx.body = { status: 200, user };
  } else {
    throw validator.error;
  }
}

async function recover(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    await usersService.recover(ctx.request.body.email, ctx);
    ctx.status = 200;
    ctx.body = { status: 200, message: 'Email sent' };
  } else {
    throw validator.error;
  }
}

async function login(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: {
        type: 'string',
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const data = await usersService.login(ctx.request.body.email, ctx.request.body.password);
    ctx.status = 200;
    ctx.body = { status: 200, user: data.user, jwtToken: data.token };
  } else {
    throw validator.error;
  }
}

async function detail(ctx) {
  const user = await usersService.detail(ctx.state.user.user);
  ctx.status = 200;
  ctx.body = { status: 200, user };
}

async function create() {}

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
    const data = await usersService.list(ctx.request.body.page, ctx.request.body.size);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function createSuperAdmin(ctx) {
  ctx.body = await usersService.addFirstSuperAdminUser(
    'Jaime',
    'Gómez Cimarro',
    'jaime@leemons.io',
    'testing',
    'es-ES'
  );
}

module.exports = {
  detail,
  reset,
  canReset,
  recover,
  login,
  create,
  list,
  createSuperAdmin,
};
