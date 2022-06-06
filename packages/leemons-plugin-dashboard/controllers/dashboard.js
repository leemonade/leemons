const { getAdminDashboard } = require('../src/services/dashboard/getAdminDashboard');

async function admin(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      start: { type: 'string' },
      end: { type: 'string' },
      program: { type: 'string' },
    },
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const data = await getAdminDashboard(ctx.request.query);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  admin,
};
