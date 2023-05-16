const regionalConfigService = require('../src/services/regional-config');

async function list(ctx) {
  const regionalConfigs = await regionalConfigService.listRegionalConfigs(
    ctx.request.params.center
  );
  ctx.status = 200;
  ctx.body = { status: 200, regionalConfigs };
}

async function save(ctx) {
  const regionalConfig = await regionalConfigService.saveRegionalConfig(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, regionalConfig };
}

module.exports = {
  list,
  save,
};
