const _ = require('lodash');
const usersService = require('../src/services/users');
const { table } = require('../src/services/tables');

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
  const user = await usersService.detail(ctx.state.userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, user };
}

async function profiles(ctx) {
  const _profiles = await usersService.profiles(ctx.state.userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, profiles: _profiles };
}

async function profileToken(ctx) {
  const jwtToken = await usersService.profileToken(ctx.state.userSession.id, ctx.params.id);

  ctx.status = 200;
  ctx.body = { status: 200, jwtToken };
}

async function setRememberProfile(ctx) {
  const profiles = await usersService.profiles(ctx.state.userSession.id);
  const index = _.findIndex(profiles, { id: ctx.request.body.id });
  if (index >= 0) {
    await table.userRememberProfile.set(
      { user: ctx.state.userSession.id },
      {
        user: ctx.state.userSession.id,
        profile: ctx.request.body.id,
      }
    );

    ctx.status = 200;
    ctx.body = { status: 200, profile: profiles[index] };
  } else {
    throw new Error('You do not have access to the specified profile');
  }
}

async function getRememberProfile(ctx) {
  const remember = await table.userRememberProfile.findOne({ user: ctx.state.userSession.id });
  if (remember) {
    const profiles = await usersService.profiles(ctx.state.userSession.id);
    const index = _.findIndex(profiles, { id: remember.profile });
    if (index >= 0) {
      ctx.status = 200;
      ctx.body = { status: 200, profile: profiles[index] };
    } else {
      ctx.status = 200;
      ctx.body = { status: 200, profile: null };
    }
  } else {
    ctx.status = 200;
    ctx.body = { status: 200, profile: null };
  }
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
  profiles,
  profileToken,
  setRememberProfile,
  getRememberProfile,
};
