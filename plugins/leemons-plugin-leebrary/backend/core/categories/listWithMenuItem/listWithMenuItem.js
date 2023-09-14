const { find, isEmpty, sortBy } = require('lodash');
const { categoriesMenu } = require('../../../config/constants');
const { list } = require('../list');

/**
 * Lists categories with menu items.
 *
 * @async
 * @function listWithMenuItem
 * @param {Object} params - The main parameter object.
 * @param {number} params.page - The page number.
 * @param {number} [params.size=999] - The size of the page.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} The list of categories with their corresponding menu items.
 */
async function listWithMenuItem({ page, size = 999, ctx }) {
  const categories = await list({ page, size, ctx });

  //   const { services: menuServices } = leemons.getPlugin('menu-builder');

  const menuItems = await ctx.tx.call('menu-builder.menu.getIfHasPermission', {
    menuKey: categoriesMenu.key,
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

  return sortBy(
    categories.items
      .map((category) => ({
        ...category,
        menuItem: find(menuItems, { key: ctx.prefixPN(category.key) }),
      }))
      .filter((item) => !isEmpty(item.menuItem)),
    'menuItem.order'
  );
}

module.exports = { listWithMenuItem };
