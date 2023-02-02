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

async function getAdminConfig(ctx) {
  const config = await configService.getFullByCenter(ctx.request.params.center);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function saveAdminConfig(ctx) {
  const config = await configService.saveFullByCenter(ctx.request.params.center, ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function getGeneralConfig(ctx) {
  const config = await configService.getGeneral();
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function getCenterConfig(ctx) {
  const config = await configService.getCenter(ctx.request.params.center);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function getProgramConfig(ctx) {
  const config = await configService.getProgram(ctx.request.params.program);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

module.exports = {
  get,
  save,
  getAdminConfig,
  saveAdminConfig,
  getCenterConfig,
  getGeneralConfig,
  getProgramConfig,
};
