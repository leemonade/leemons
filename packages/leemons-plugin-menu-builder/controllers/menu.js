const menuService = require('../src/services/menu');
const menuItemService = require('../src/services/menu-item');
const { table } = require('../src/tables');
const {
  validateReOrder,
  validateAddMenuItemFromUser,
  validateUpdateMenuItemFromUser,
  validateRemoveMenuItemFromUser,
} = require('../src/validations/menu-item');

async function getMenu(ctx) {
  const menu = await menuService.getIfHasPermission(ctx.params.key, ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, menu };
}

async function addMenuItem(ctx) {
  ctx.request.body.menuKey = ctx.params.key;
  ctx.request.body.pluginName = leemons.plugin.prefixPN('');
  validateAddMenuItemFromUser(ctx.request.body);

  const menuItem = await menuItemService.addCustomForUser(ctx.state.userSession, ctx.request.body);

  ctx.status = 201;
  ctx.body = { status: 201, menuItem };
}

async function removeMenuItem(ctx) {
  validateRemoveMenuItemFromUser(ctx.params);

  const removed = await menuItemService.removeCustomForUser(
    ctx.state.userSession,
    ctx.params.menuKey,
    ctx.params.key
  );

  ctx.status = 200;
  ctx.body = { status: 200, removed };
}

async function updateMenuItem(ctx) {
  validateUpdateMenuItemFromUser({ ...ctx.params, ...ctx.request.body });

  const updated = await menuItemService.updateCustomForUser(
    ctx.state.userSession,
    ctx.params.menuKey,
    ctx.params.key,
    ctx.request.body
  );

  ctx.status = 200;
  ctx.body = { status: 200, updated };
}

async function reOrder(ctx) {
  validateReOrder({ ...ctx.request.body, menuKey: ctx.params.key });
  const items = await menuItemService.reOrderCustomUserItems(
    ctx.params.key,
    ctx.request.body.parentKey,
    ctx.request.body.orderedIds,
    ctx.state.userSession
  );

  ctx.status = 201;
  ctx.body = { status: 201, items };
}

async function getIfKnowHowToUse(ctx) {
  const knowHowToUse = await table.knowHowToUse.count({ user: ctx.state.userSession.id });
  ctx.status = 200;
  ctx.body = { status: 200, knowHowToUse: !!knowHowToUse };
}

async function setKnowHowToUse(ctx) {
  await table.knowHowToUse.create({ user: ctx.state.userSession.id });
  ctx.status = 201;
  ctx.body = { status: 201, knowHowToUse: true };
}

module.exports = {
  getMenu,
  addMenuItem,
  removeMenuItem,
  reOrder,
  getIfKnowHowToUse,
  setKnowHowToUse,
  updateMenuItem,
};
