/* eslint-disable no-await-in-loop */
const { isArray } = require('lodash');
const getMenuBuilder = require('./getMenuBuilder');

async function addMenuItem({ menuItem, config }, { item, permissions }) {
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

async function add(itemData, shouldWait = false) {
  let items = itemData;
  if (!isArray(itemData)) {
    items = [itemData];
  }

  const menuBuilder = getMenuBuilder();
  const { services } = menuBuilder;

  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems = [];

    for (let i = 0; i < itemsLength; i++) {
      const item = await addMenuItem(services, items[i]);
      menuItems.push(item);
    }

    return menuItems;
  }
  return Promise.all(items.map((item) => addMenuItem(services, item)));
}

module.exports = add;
