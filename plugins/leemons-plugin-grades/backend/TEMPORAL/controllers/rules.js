const rulesService = require('../src/services/rules');

async function haveRules(ctx) {
  const have = await rulesService.haveRules();
  ctx.status = 200;
  ctx.body = { status: 200, have };
}

async function postRule(ctx) {
  const rule = await rulesService.addRule(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, rule };
}

async function putRule(ctx) {
  const rule = await rulesService.updateRule(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, rule };
}

async function deleteRule(ctx) {
  await rulesService.removeRule(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function postRuleProcess(ctx) {
  const results = await rulesService.processRulesForUserAgent(
    ctx.request.body.rule,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, results };
}

async function listRules(ctx) {
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
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  putRule,
  postRule,
  haveRules,
  listRules,
  deleteRule,
  postRuleProcess,
};
