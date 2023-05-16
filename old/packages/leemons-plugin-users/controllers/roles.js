const rolesService = require('../src/services/roles');
const groupsService = require('../src/services/groups');

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
    const { page, size } = ctx.request.body;
    const data = await groupsService.list(page, size);
    ctx.status = 200;
    ctx.body = { status: 200, data };
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
    const role = await groupsService.detailByUri(ctx.request.params.uri);
    ctx.status = 200;
    ctx.body = { status: 200, role };
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
    },
    required: ['name', 'description', 'permissions'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const role = await groupsService.addWithRole(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, role };
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
      userAgents: { type: 'array', items: { type: 'string' } },
    },
    required: ['id', 'name', 'description', 'permissions'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const role = await groupsService.updateWithRole(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, role };
  } else {
    throw validator.error;
  }
}

module.exports = {
  add,
  list,
  detail,
  create,
  update,
  listForCenter,
};
