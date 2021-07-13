const menuService = require('../src/services/menu');
const menuItemService = require('../src/services/menu-item');
const prefixPN = require('../src/helpers/prefixPN');
const { validateReOrder } = require('../src/validations/menu-item');
const { validateAddMenuItemFromUser } = require('../src/validations/menu-item');

async function getMenu(ctx) {
  const menu = await menuService.getIfHasPermission(ctx.params.key, ctx.state.user);
  ctx.status = 201;
  ctx.body = { status: 201, menu };
}

async function addMenuItem(ctx) {
  ctx.request.body.menuKey = ctx.params.key;
  ctx.request.body.pluginName = prefixPN('');
  validateAddMenuItemFromUser(ctx.request.body);

  const menuItem = await menuItemService.addCustomForUser(ctx.state.user, ctx.request.body);

  ctx.status = 201;
  ctx.body = { status: 201, menuItem };
}

async function reOrder(ctx) {
  validateReOrder({ ...ctx.request.body, menuKey: ctx.params.key });
  const items = await menuItemService.reOrderCustomUserItems(
    ctx.params.key,
    ctx.request.body.parentKey,
    ctx.request.body.orderedIds,
    ctx.state.user
  );

  ctx.status = 201;
  ctx.body = { status: 201, items };
}

module.exports = {
  getMenu,
  addMenuItem,
  reOrder,
};
