const _ = require('lodash');

const pluginManagerService = require('../src/services/package-manager');

async function install(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      name: { type: 'string' },
      version: { type: 'string' },
    },
    required: ['name', 'version'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const installed = await pluginManagerService.install(
      ctx.request.body.name,
      ctx.request.body.version,
      ctx.status.userSession
    );
    ctx.status = 200;
    ctx.body = { status: 200, installed };
  } else {
    throw validator.error;
  }
}

async function remove(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const removed = await pluginManagerService.remove(
      ctx.request.body.name,
      ctx.status.userSession
    );
    ctx.status = 200;
    ctx.body = { status: 200, removed };
  } else {
    throw validator.error;
  }
}

async function info(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const data = await pluginManagerService.info(ctx.request.body.name, ctx.status.userSession);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  install,
  remove,
  info,
};
