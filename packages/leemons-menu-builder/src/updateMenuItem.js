const _ = require('lodash');

async function exec({ item: { item, permissions }, menuKey, ctx }) {
  if (
    await ctx.tx.call('menu-builder.menuItem.exist', {
      menuKey,
      key: ctx.prefixPN(item.key),
    })
  ) {
    const result = await ctx.tx.call('menu-builder.menuItem.update', {
      ...item,
      menuKey,
      key: ctx.prefixPN(item.key),
      permissions,
      ctx,
    });
    ctx.tx.emit(`update-menu-item-${menuKey}.${item.key}`);
    return result;
  }
  return null;
}

async function updateMenuItem({ item, menuKey = 'menu-builder.main', shouldWait = false, ctx }) {
  const items = _.isArray(item) ? item : [item];

  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems = [];

    for (let i = 0; i < itemsLength; i++) {
      // eslint-disable-next-line no-await-in-loop
      menuItems.push(await exec({ item: items[i], menuKey, ctx }));
    }
    return menuItems;
  }
  return Promise.all(_.map(items, (l) => exec({ item: l, menuKey, ctx })));
}

module.exports = { updateMenuItem };
