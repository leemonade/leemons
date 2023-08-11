const _ = require('lodash');
const messagesService = require('../src/services/messages');

async function list(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      filters: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const { page, size } = ctx.request.body;
    const data = await messagesService.list(parseInt(page, 10), parseInt(size, 10), {
      userSession: ctx.state.userSession,
      filters: ctx.request.body.filters,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function save(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const message = await messagesService.save(data, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, message };
}

async function getActive(ctx) {
  const message = await messagesService.getActive(ctx.request.body, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, message };
}

async function getOverlaps(ctx) {
  const messages = await messagesService.getOverlapsWithOtherConfigurations(ctx.request.body, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, messages };
}

async function addClick(ctx) {
  const messages = await messagesService.addClick(ctx.request.body.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, messages };
}

async function addView(ctx) {
  const messages = await messagesService.addView(ctx.request.body.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, messages };
}

module.exports = {
  list,
  save,
  addView,
  addClick,
  getActive,
  getOverlaps,
};
