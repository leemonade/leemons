const menuService = require('../src/services/menu');

async function getMenu(ctx) {
  const menu = await menuService.getIfHasPermission(ctx.params.key, ctx.state.user);
  ctx.status = 201;
  ctx.body = { status: 201, menu };
}

module.exports = {
  getMenu,
};
