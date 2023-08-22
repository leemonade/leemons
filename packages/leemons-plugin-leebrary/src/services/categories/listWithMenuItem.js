const { find, isEmpty, sortBy } = require('lodash');
const { categoriesMenu } = require('../../../config/constants');
const { list } = require('./list');

/**
 * Asynchronously lists menu items with categories.
 *
 * @async
 * @function listWithMenuItem
 * @param {number} page - The page number for pagination.
 * @param {number} [size=999] - The size of the page for pagination.
 * @param {Object} options - An object containing additional parameters.
 * @param {Object} options.transacting - The transaction object for the database operation.
 * @param {Object} options.userSession - The user session object.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of menu items with categories.
 */
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
