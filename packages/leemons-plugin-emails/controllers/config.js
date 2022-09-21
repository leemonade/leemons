const configService = require('../src/services/config');

async function getConfig(ctx) {
  const configs = await configService.getConfig(ctx.state.userSession.userAgents[0].id);
  ctx.status = 200;
  ctx.body = { status: 200, configs };
}

async function saveConfig(ctx) {
  const configs = await configService.saveConfig(
    ctx.state.userSession.userAgents[0].id,
    ctx.request.body
  );
  ctx.status = 200;
  ctx.body = { status: 200, configs };
}

module.exports = {
  getConfig,
  saveConfig,
};
