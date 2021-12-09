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

module.exports = {
  putDependency,
  postDependency,
  deleteDependency,
};
