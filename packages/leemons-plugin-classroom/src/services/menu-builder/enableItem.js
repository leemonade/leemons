const update = require('./update');
const { menuItems } = require('../../../config/constants');

async function enableItem(key) {
  try {
    const { item } = menuItems.find((menuItem) => menuItem.item.key === key);

    if (item) {
      return update({
        ...item,
        disabled: false,
      });
    }
    return null;
  } catch (e) {
    throw new Error(`No menuItem with the key ${key} was found`);
  }
}

module.exports = enableItem;
