const _ = require('lodash');
const rulesService = require('../src/services/rules');

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
  await rulesService.removeRule(ctx.request.query.id);
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

module.exports = {
  putRule,
  postRule,
  deleteRule,
  postRuleProcess,
};
