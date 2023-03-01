const { menuItems } = require('../../../config/constants');
const enableItem = require('./enableItem');

async function enableAllItems() {
  await Promise.all(menuItems.map(({ item }) => enableItem(item.key, item)));
}

module.exports = enableAllItems;
