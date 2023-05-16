const rulesService = require('../src/services/rules');

async function postDependency(ctx) {
  const rule = await rulesService.addRule(ctx.request.body, { isDependency: true });
  ctx.status = 200;
  ctx.body = { status: 200, rule };
}

async function putDependency(ctx) {
  const rule = await rulesService.updateRule(ctx.request.body, { isDependency: true });
  ctx.status = 200;
  ctx.body = { status: 200, rule };
}

async function deleteDependency(ctx) {
  await rulesService.removeRule(ctx.request.params.id, { isDependency: true });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function listDependencies(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      center: { type: ['string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, center, ...options } = ctx.request.query;
    const data = await rulesService.listRules(parseInt(page, 10), parseInt(size, 10), center, {
      isDependency: true,
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  putDependency,
  postDependency,
  deleteDependency,
  listDependencies,
};
