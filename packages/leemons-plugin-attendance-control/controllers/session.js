const _ = require('lodash');
const sessionService = require('../src/services/session');

async function getTemporalSessions(ctx) {
  const sessions = await sessionService.getTemporalSessions(ctx.request.params.class);
  ctx.status = 200;
  ctx.body = { status: 200, sessions };
}

module.exports = {
  getTemporalSessions,
};
