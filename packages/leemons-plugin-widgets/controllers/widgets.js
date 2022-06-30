const zoneService = require('../src/services/widget-zone');

async function getZone(ctx) {
  const zone = await zoneService.get(ctx.params.key, { userSession: ctx.state.userSession });
  ctx.status = 200;
  ctx.body = { status: 200, zone };
}

module.exports = {
  getZone,
};
