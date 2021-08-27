const settingsService = require('../src/services/settings');
const menuBuilderService = require('../src/services/menu-builder');
const settingsSchema = require('../models/settings');

async function findOne(ctx) {
  const settings = await settingsService.findOne();
  ctx.status = 200;
  ctx.body = { status: 200, settings };
}

async function update(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: { ...settingsSchema.attributes },
    required: [],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const settings = await settingsService.update(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, settings };
  } else {
    throw validator.error;
  }
}

async function enableMenuItem(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: { key: { type: 'string' } },
    required: ['key'],
  });
  if (validator.validate(ctx.request.body)) {
    const item = await menuBuilderService.enableItem(ctx.request.body.key);
    ctx.status = 200;
    ctx.body = { status: 200, item };
  } else {
    throw validator.error;
  }
}

module.exports = {
  findOne,
  update,
  enableMenuItem,
};
