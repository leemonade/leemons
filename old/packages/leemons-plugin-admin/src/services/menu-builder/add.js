const getMenuBuilder = require('./getMenuBuilder');

async function addMenuItem({ menuItem: menuItemService, config }, { item, permissions }) {
  const menuKey = config.constants.mainMenuKey;
  const key = leemons.plugin.prefixPN(item.key);

  const existMenuItem = await menuItemService.exist(menuKey, key);

  if (!existMenuItem) {
    // console.log('Not existMenuItem: ', existMenuItem);
    // console.log('menuKey:', menuKey);
    // console.log('key:', key);

    return menuItemService.add(
      {
        ...item,
        menuKey,
        key,
        parentKey: item.parentKey ? leemons.plugin.prefixPN(item.parentKey) : undefined,
      },
      permissions
    );
  }

  // const currentItem = await menuItemService.getByMenuAndKey(menuKey, key);
  // console.log('currentItem:');
  // console.dir(currentItem, { depth: null });

  // console.log('newItem:');
  // console.dir(item, { depth: null });

  return menuItemService.update(
    menuKey,
    key,
    { ...item, parentKey: item.parentKey ? leemons.plugin.prefixPN(item.parentKey) : undefined },
    permissions
  );
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
