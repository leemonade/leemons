/* eslint-disable no-await-in-loop */
const { isArray } = require('lodash');
const constants = require('../../config/constants');
const { add: addItem } = require('./add');
const { exist: existItem } = require('./exist');
const { remove: removeItem } = require('./remove');

async function addMenuItem({ menuKey, removed, item, permissions, ctx }) {
  if (!(await existItem({ menuKey, key: `${ctx.callerPlugin}.${item.key}`, ctx }))) {
    if (!removed) {
      return addItem({
        ...item,
        menuKey,
        key: `${ctx.callerPlugin}.${item.key}`,
        parentKey: item.parentKey ? `${ctx.callerPlugin}.${item.parentKey}` : undefined,
        permissions,
        ctx,
      });
    }
    return null;
  }
  if (removed) {
    // ES: Si existe pero deberia de estar borrado lo borramos
    await removeItem({ menuKey, key: `${ctx.callerPlugin}.${item.key}`, ctx });
  }
  return null;
}

async function addItemsFromPlugin({
  itemsData,
  shouldWait = false,
  menuKey = constants.mainMenuKey,
  ctx,
}) {
  let items = itemsData;
  if (!isArray(itemsData)) {
    items = [itemsData];
  }
  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems = [];

    for (let i = 0; i < itemsLength; i++) {
      const item = await addMenuItem({ ...items[i], menuKey, ctx });
      menuItems.push(item);
    }

    return menuItems;
  }

  return Promise.all(items.map((item) => addMenuItem({ ...item, menuKey, ctx })));
}

module.exports = { addItemsFromPlugin };
