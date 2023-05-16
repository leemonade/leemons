const configService = require('../src/services/config');

async function get(ctx) {
  const config = await configService.getConfig(ctx.request.params.programId);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function save(ctx) {
  const config = await configService.saveConfig(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

module.exports = {
  get,
  save,
};
