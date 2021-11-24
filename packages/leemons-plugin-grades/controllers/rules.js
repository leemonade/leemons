const _ = require('lodash');
const rulesService = require('../src/services/rules');

async function postRule(ctx) {
  const rule = await rulesService.addRule(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, rule };
}

module.exports = {
  postRule,
};
