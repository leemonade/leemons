const configService = require('../src/services/config');

async function get(ctx) {
  const config = await configService.get(ctx.state.userSession.userAgents[0].id);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function save(ctx) {
  const config = await configService.save(ctx.state.userSession.userAgents[0].id, ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

module.exports = {
  get,
  save,
};
