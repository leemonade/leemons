const settingsService = require('../src/services/settings');
const enableMenuItemService = require('../src/services/menu-builder/enableItem');
const removeMenuItemService = require('../src/services/menu-builder/remove');
const settingsSchema = require('../models/settings');

module.exports = {
  findOne: async (ctx) => {
    const settings = await settingsService.findOne();
    ctx.status = 200;
    ctx.body = { status: 200, settings };
  },
  update: async (ctx) => {
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
  },
  enableMenuItem: async (ctx) => {
    const validator = new global.utils.LeemonsValidator({
      type: 'object',
      properties: { key: { type: 'string' } },
      required: ['key'],
    });
    if (validator.validate(ctx.request.body)) {
      const item = await enableMenuItemService(ctx.request.body.key);
      ctx.status = 200;
      ctx.body = { status: 200, item };
    } else {
      throw validator.error;
    }
  },
  removeMenuItem: async (ctx) => {
    const validator = new global.utils.LeemonsValidator({
      type: 'object',
      properties: { key: { type: 'string' } },
      required: ['key'],
    });
    if (validator.validate(ctx.request.body)) {
      const item = await removeMenuItemService(ctx.request.body.key);
      ctx.status = 200;
      ctx.body = { status: 200, item };
    } else {
      throw validator.error;
    }
  },
};
