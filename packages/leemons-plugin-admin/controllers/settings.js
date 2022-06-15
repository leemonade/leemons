const settingsService = require('../src/services/settings');
const settingsSchema = require('../models/settings');

async function setLanguages(ctx) {
  const { langs, defaultLang } = ctx.request.body;

  console.log('langs:', langs);
  console.log('defaultLang:', defaultLang);

  try {
    await settingsService.setLanguages(langs, defaultLang);
    const settings = await settingsService.findOne();

    ctx.status = 200;
    ctx.body = { status: 200, settings };
  } catch (e) {
    ctx.status = 400;
    ctx.body = { status: 400, error: e.message };
  }
}

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
  setLanguages,
};
