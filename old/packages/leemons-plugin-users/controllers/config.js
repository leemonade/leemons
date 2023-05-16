const configService = require('../src/services/config');

async function getSystemDataFieldsConfig(ctx) {
  const config = await configService.getSystemDataFieldsConfig();
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function saveSystemDataFieldsConfig(ctx) {
  const config = await configService.saveSystemDataFieldsConfig(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

module.exports = {
  getSystemDataFieldsConfig,
  saveSystemDataFieldsConfig,
};
