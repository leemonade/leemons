const emailService = require('../src/services/email');

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

async function providers(ctx) {
  ctx.body = { providers: emailService.providers() };
}

async function sendTest(ctx) {
  const validator = new global.utils.LeemonsValidator(validateProviderConfigObj);
  if (validator.validate(ctx.request.body)) {
    const data = await emailService.sendTest(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function addProvider(ctx) {
  const validator = new global.utils.LeemonsValidator(validateProviderConfigObj);
  if (validator.validate(ctx.request.body)) {
    await emailService.addProvider(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200 };
  } else {
    throw validator.error;
  }
}

module.exports = {
  addProvider,
  providers,
  sendTest,
};
