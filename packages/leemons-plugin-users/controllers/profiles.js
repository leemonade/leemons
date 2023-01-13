const profileService = require('../src/services/profiles');
const usersService = require('../src/services/users');

const permissionsValidation = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      permissionName: {
        type: 'string',
      },
      actionNames: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};

const translationsValidations = {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
    description: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
  },
};

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
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const { page, size, ...options } = ctx.request.body;
    const data = await profileService.list(page, size, { ...options });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function add(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      permissions: permissionsValidation,
      translations: translationsValidations,
    },
    required: ['name', 'description', 'permissions'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const profile = await profileService.add(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, profile };
  } else {
    throw validator.error;
  }
}

async function detail(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      uri: { type: 'string' },
    },
    required: ['uri'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.params)) {
    const profile = await profileService.detailByUri(ctx.request.params.uri);
    ctx.status = 200;
    ctx.body = { status: 200, profile };
  } else {
    throw validator.error;
  }
}

async function update(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      permissions: permissionsValidation,
      translations: translationsValidations,
    },
    required: ['id', 'name', 'description', 'permissions'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const profile = await profileService.update(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, profile };
  } else {
    throw validator.error;
  }
}

async function getProfileSysName(ctx) {
  const sysName = await profileService.getProfileSysName(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, sysName };
}

async function addAllPermissionsToAllProfiles(ctx) {
  if (process.env.NODE_ENV !== 'production') {
    const profile = await profileService.addAllPermissionsToAllProfiles();
    ctx.status = 200;
    ctx.body = { status: 200, profile };
  } else {
    ctx.status = 200;
    ctx.body = { status: 200, message: 'Disabled in production' };
  }
}

module.exports = {
  list,
  add,
  detail,
  update,
  getProfileSysName,
  addAllPermissionsToAllProfiles,
};
