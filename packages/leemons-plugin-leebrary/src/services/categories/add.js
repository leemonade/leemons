const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { exists } = require('./exists');
const { categoriesMenu } = require('../../../config/constants');

async function add(data, { transacting } = {}) {
  const { menu, ...categoryData } = data;

  if (isEmpty(categoryData.key)) {
    throw new Error('Category `key` is required');
  }

  if (isEmpty(menu)) {
    throw new Error('Category `menu` is required');
  }

  if (await exists(categoryData, { transacting })) {
    throw new Error('Previous category with this `key` was already registered');
  }

  try {
    const newCategory = await tables.categories.create(categoryData, { transacting });

    // Add Menu item
    const { services } = leemons.getPlugin('menu-builder');
    const menuItem = {
      item: { ...menu.item, key: categoryData.key },
      permissions: menu.permissions,
    };
    await services.menuItem.addItemsFromPlugin(menuItem, false, categoriesMenu.key, {
      transacting,
    });

    return newCategory;
  } catch (e) {
    throw new Error(`Failed to register category: ${e.message}`);
  }
}

module.exports = { add };
