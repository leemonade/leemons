const getMenuBuilder = require('./getMenuBuilder');

async function addMenuItem({ menuItem, config }, { item, permissions }) {
  // eslint-disable-next-line no-await-in-loop
  if (!(await menuItem.exist(config.constants.mainMenuKey, leemons.plugin.prefixPN(item.key)))) {
    return menuItem.add(
      {
        ...item,
        menuKey: config.constants.mainMenuKey,
        key: leemons.plugin.prefixPN(item.key),
        parentKey: item.parentKey ? leemons.plugin.prefixPN(item.parentKey) : undefined,
      },
      permissions
    );
  }
  return null;
}

async function add(_items, shouldWait = false) {
  let items = _items;
  if (!Array.isArray(_items)) {
    items = [_items];
  }

  const menuBuilder = getMenuBuilder();
  const { services } = menuBuilder;

  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems = [];

    for (let i = 0; i < itemsLength; i++) {
      // eslint-disable-next-line no-await-in-loop
      menuItems.push(await addMenuItem(services, items[i]));
    }
    return menuItems;
  }
  return Promise.all(items.map((item) => addMenuItem(services, item)));
}

module.exports = add;
