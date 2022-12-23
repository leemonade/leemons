const cycleService = require('../src/services/cycle');

async function putCycle(ctx) {
  const cycle = await cycleService.updateCycle(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, cycle };
}

module.exports = {
  putCycle,
};
