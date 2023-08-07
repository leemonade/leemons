const { find, isEmpty, sortBy } = require('lodash');
const { categoriesMenu } = require('../../../config/constants');
const { list } = require('./list');

async function listWithMenuItem(page, size = 999, { transacting, userSession } = {}) {
  const categories = await list(page, size, { transacting });
  const { services: menuServices } = leemons.getPlugin('menu-builder');

  const menuItems = await menuServices.menu.getIfHasPermission(categoriesMenu.key, userSession, {
    transacting,
  });

  /*
  const orderKeys = [
    'media-files',
    'bookmarks',
    'assignables.task',
    'tests-questions-banks',
    'assignables.tests',
  ];

  const items = categories.items.sort(
    (a, b) => orderKeys.indexOf(a.key) - orderKeys.indexOf(b.key)
  );

   */

  const result = sortBy(
    categories.items
      .map((category) => ({
        ...category,
        menuItem: find(menuItems, { key: leemons.plugin.prefixPN(category.key) }),
      }))
      .filter((item) => !isEmpty(item.menuItem)),
    'menuItem.order'
  );

  return result;
}

module.exports = { listWithMenuItem };
