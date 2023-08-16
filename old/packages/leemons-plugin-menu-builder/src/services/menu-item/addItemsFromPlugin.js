/* eslint-disable no-await-in-loop */
const { isArray } = require('lodash');
const constants = require('../../../config/constants');
const addItem = require('./add');
const existItem = require('./exist');
const removeItem = require('./remove');

async function addMenuItem(menuKey, { removed, item, permissions }, { transacting }) {
  if (!(await existItem.call(this, menuKey, `${this.calledFrom}.${item.key}`, { transacting }))) {
    if (!removed) {
      return addItem.call(
        this,
        {
          ...item,
          menuKey,
          key: `${this.calledFrom}.${item.key}`,
          parentKey: item.parentKey ? `${this.calledFrom}.${item.parentKey}` : undefined,
        },
        permissions,
        { transacting }
      );
    }
    return null;
  }
  if (removed) {
    // ES: Si existe pero deberia de estar borrado lo borramos
    await removeItem.call(this, menuKey, `${this.calledFrom}.${item.key}`);
  }
  return null;
}

async function addItemsFromPlugin(
  itemsData,
  shouldWait = false,
  menuKey = constants.mainMenuKey,
  { transacting } = {}
) {
  let items = itemsData;
  if (!isArray(itemsData)) {
    items = [itemsData];
  }

  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems = [];

    for (let i = 0; i < itemsLength; i++) {
      const item = await addMenuItem.call(this, menuKey, items[i], { transacting });
      menuItems.push(item);
    }

    return menuItems;
  }

  return Promise.all(items.map((item) => addMenuItem.call(this, menuKey, item, { transacting })));
}

module.exports = addItemsFromPlugin;
