const usersService = require('../services/private/users');

async function reset(ctx) {
  try {
    const validator = new global.utils.LeemonsValidator({
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        code: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'code', 'password'],
      additionalProperties: false,
    });
    if (validator.validate(ctx.request.body)) {
      const user = await usersService.reset(
        ctx.request.body.email,
        ctx.request.body.code,
        ctx.request.body.password
      );
      ctx.status = 200;
      ctx.body = { status: 200, user };
    } else {
      throw new Error(validator.error);
    }
  } catch (err) {
    global.utils.returnError(ctx, err);
  }
}

async function recover(ctx) {
  try {
    const validator = new global.utils.LeemonsValidator({
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
      additionalProperties: false,
    });
    if (validator.validate(ctx.request.body)) {
      await usersService.recover(ctx.request.body.email);
      ctx.status = 200;
      ctx.body = { status: 200, message: 'Email sent' };
    } else {
      throw new Error(validator.error);
    }
  } catch (err) {
    global.utils.returnError(ctx, err);
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
    throw new Error(validator.error);
  }
}

async function detail(ctx) {
  try {
    const user = await usersService.detail(ctx.user.id);
    ctx.status = 200;
    ctx.body = { status: 200, user };
  } catch (err) {
    global.utils.returnError(ctx, err);
  }
}

async function create(ctx) {
  /*
  const ajv = new Ajv({ allErrors: true });
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      test: { type: 'string' },
    },
    required: ['name', 'test'],
    additionalProperties: false,
  };
  if (ajv.validate(schema, ctx.request.body)) {
  } else {
    console.log('error', ajv.errors);
  }
  ctx.body = { test: 'Holaaa' };
  return ctx.body;

   */
}

async function createSuperAdmin(ctx) {
  ctx.body = await usersService.registerFirstSuperAdminUser(
    'Pepe',
    'pruebas',
    'testing@test.io',
    'testing'
  );
}

module.exports = {
  detail,
  reset,
  recover,
  login,
  create,
  createSuperAdmin,
};
