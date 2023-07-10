const { getAdminDashboard } = require('../src/services/dashboard/getAdminDashboard');
const {
  getAdminDashboardRealtime,
} = require('../src/services/dashboard/getAdminDashboardRealtime');

async function admin(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      start: { type: 'string' },
      end: { type: 'string' },
      program: { type: 'string' },
      center: { type: 'string' },
    },
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const data = await getAdminDashboard(ctx.request.query, { userSession: ctx.state.userSession });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function adminRealtime(ctx) {
  const data = await getAdminDashboardRealtime(ctx.request.query);
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

module.exports = {
  admin,
  adminRealtime,
};
