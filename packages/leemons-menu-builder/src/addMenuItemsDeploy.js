const _ = require('lodash');
const { hasKey, setKey } = require('leemons-mongodb-helpers');

async function exec({ keyValueModel, item: { item, permissions, removed }, menuKey, ctx }) {
  if (
    !(await hasKey(keyValueModel, `menu-item-${menuKey}-${item.key}`)) ||
    process.env.RELOAD_MENU_ITEMS_ON_EVERY_INSTALL === 'true'
  ) {
    if (
      !(await ctx.call('menu-builder.menuItem.exist', {
        menuKey,
        key: ctx.prefixPN(item.key),
      }))
    ) {
      if (!removed) {
        await ctx.call('menu-builder.menuItem.add', {
          ...item,
          menuKey,
          key: ctx.prefixPN(item.key),
          permissions,
        });
      }
    }
    if (removed) {
      // ES: Si existe pero deberia de estar borrado lo borramos
      await ctx.call('menu-builder.menuItem.remove', {
        menuKey,
        key: ctx.prefixPN(item.key),
      });
    }
    await setKey(keyValueModel, `menu-item-${menuKey}-${item.key}`);
  }
  ctx.emit(`init-menu-item-${menuKey}.${item.key}`);
}

/**
 * menu = {key: string, permissions: any}
 */
async function addMenuItemsDeploy({
  keyValueModel,
  item,
  menuKey = 'menu-builder.main',
  shouldWait = false,
  ctx,
}) {
  const items = _.isArray(item) ? item : [item];

  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems = [];

    for (let i = 0; i < itemsLength; i++) {
      // eslint-disable-next-line no-await-in-loop
      menuItems.push(await exec({ keyValueModel, item: items[i], menuKey, ctx }));
    }
    return menuItems;
  }
  return Promise.all(_.map(items, (l) => exec({ keyValueModel, item: l, menuKey, ctx })));
}

module.exports = { addMenuItemsDeploy };
