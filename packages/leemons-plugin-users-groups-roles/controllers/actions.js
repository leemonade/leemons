const actionsService = require('../services/private/actions');

async function list(ctx) {
  const actions = await actionsService.list();
  ctx.status = 200;
  ctx.body = { status: 200, actions };
}

module.exports = {
  list,
};
