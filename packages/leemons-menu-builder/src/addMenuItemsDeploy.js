const _ = require('lodash');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');

async function exec({
  config,
  keyValueModel,
  item: { item, permissions, removed, isCustomPermission },
  menuKey,
  ctx,
}) {
  let toRemove = removed;

  const disableMenuKeys = config[ctx.prefixPNV()]?.deny?.menu;
  if (disableMenuKeys?.indexOf(item.key) >= 0) {
    toRemove = true;
  }
  if (
    !(await hasKey(keyValueModel, `menu-item-${menuKey}-${item.key}`)) ||
    process.env.RELOAD_MENU_ITEMS_ON_EVERY_INSTALL === 'true'
  ) {
    if (
      !(await ctx.tx.call('menu-builder.menuItem.exist', {
        menuKey,
        key: ctx.prefixPN(item.key),
      }))
    ) {
      if (!toRemove) {
        await ctx.tx.call('menu-builder.menuItem.add', {
          ...item,
          menuKey,
          key: ctx.prefixPN(item.key),
          permissions,
          isCustomPermission,
        });
      }
    } else if (toRemove) {
      // ES: Si existe pero deberia de estar borrado lo borramos
      await ctx.tx.call('menu-builder.menuItem.remove', {
        menuKey,
        key: ctx.prefixPN(item.key),
      });
    }
    await setKey(keyValueModel, `menu-item-${menuKey}-${item.key}`);
  }
  ctx.tx.emit(`init-menu-item-${menuKey}.${item.key}`);
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
  const config = await ctx.tx.call('deployment-manager.getConfigRest', { allConfig: true });
  const items = _.isArray(item) ? item : [item];

  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems = [];

    for (let i = 0; i < itemsLength; i++) {
      // eslint-disable-next-line no-await-in-loop
      menuItems.push(await exec({ config, keyValueModel, item: items[i], menuKey, ctx }));
    }
    return menuItems;
  }
  return Promise.all(_.map(items, (l) => exec({ config, keyValueModel, item: l, menuKey, ctx })));
}

module.exports = { addMenuItemsDeploy };
