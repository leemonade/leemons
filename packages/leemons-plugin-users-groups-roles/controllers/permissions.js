const permissionsService = require('../services/private/permissions');

async function list(ctx) {
  const permissions = await permissionsService.list();
  ctx.status = 200;
  ctx.body = { status: 200, permissions };
}

module.exports = {
  list,
};
