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

const validateRemoveProviderConfigObj = {
  type: 'object',
  properties: {
    providerName: { type: 'string' },
    id: { type: 'string' },
  },
  required: ['providerName', 'id'],
  additionalProperties: false,
};

async function providers(ctx) {
  const _providers = await emailService.providers();
  ctx.body = { providers: _providers };
}

async function sendTest(ctx) {
  /*
  const validator = new global.utils.LeemonsValidator(validateProviderConfigObj);
  if (validator.validate(ctx.request.body)) {
    const data = await emailService.sendTest(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
  */
}

async function sendCustomTest(ctx) {
  /*
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      from: { type: 'string' },
      to: { type: 'string' },
      body: { type: 'string' },
      subject: { type: 'string' },
    },
    required: ['from', 'to', 'body', 'subject'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const data = await emailService.sendCustomTest(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
  */
}

async function saveProvider(ctx) {
  const validator = new global.utils.LeemonsValidator(validateProviderConfigObj);
  if (validator.validate(ctx.request.body)) {
    const provider = await emailService.saveProvider(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, provider };
  } else {
    throw validator.error;
  }
}

async function removeProvider(ctx) {
  const validator = new global.utils.LeemonsValidator(validateRemoveProviderConfigObj);
  if (validator.validate(ctx.request.body)) {
    await emailService.removeProvider(ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200 };
  } else {
    throw validator.error;
  }
}

module.exports = {
  removeProvider,
  saveProvider,
  providers,
  sendTest,
  sendCustomTest,
};
