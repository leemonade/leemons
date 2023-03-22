const _ = require('lodash');
const sessionService = require('../src/services/session');

async function getTemporalSessions(ctx) {
  const sessions = await sessionService.getTemporalSessions(ctx.request.params.class);
  ctx.status = 200;
  ctx.body = { status: 200, sessions };
}

async function save(ctx) {
  const session = await sessionService.save(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, session };
}

async function detail(ctx) {
  const [session] = await sessionService.byIds(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, session };
}

module.exports = {
  save,
  detail,
  getTemporalSessions,
};
