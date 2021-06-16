const emailService = require('../services/private/email');

const validateProviderConfigObj = {
  type: 'object',
  properties: {
    providerName: { type: 'string' },
    config: {
      type: 'object',
    },
  },
  required: ['providerName', 'config'],
  additionalProperties: false,
};

async function init(ctx) {
  await emailService.init();
  ctx.body = { status: 200 };
}

async function providers(ctx) {
  ctx.body = { providers: emailService.providers() };
}

async function sendTest(ctx) {
  const validator = new global.utils.LeemonsValidator(validateProviderConfigObj);
  if (validator.validate(ctx.request.body)) {
    await emailService.sendTest(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200 };
  } else {
    throw new Error(validator.error);
  }
}

async function addProvider(ctx) {
  const validator = new global.utils.LeemonsValidator(validateProviderConfigObj);
  if (validator.validate(ctx.request.body)) {
    await emailService.addProvider(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200 };
  } else {
    throw new Error(validator.error);
  }
}

module.exports = {
  addProvider,
  providers,
  sendTest,
  init,
};
