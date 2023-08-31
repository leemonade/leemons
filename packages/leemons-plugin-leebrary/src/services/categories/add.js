const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { exists } = require('./exists');
const { categoriesMenu } = require('../../../config/constants');

async function add(data, { transacting } = {}) {
  const { menu, ...categoryData } = data;

  if (isEmpty(categoryData.key)) {
    throw new global.utils.HttpError(400, 'Category `key` is required');
  }

  if (isEmpty(menu)) {
    throw new global.utils.HttpError(400, 'Category `menu` is required');
  }

  try {
    let newCategory = null;
    if (!(await exists(categoryData, { transacting }))) {
      newCategory = await tables.categories.create(
        {
          ...categoryData,
          canUse: JSON.stringify(categoryData.canUse),
          pluginOwner: this.calledFrom,
          componentOwner: categoryData.componentOwner || this.calledFrom,
        },
        { transacting }
      );
    }

    // Add Menu item
    const { services } = leemons.getPlugin('menu-builder');
    const menuItem = {
      removed: menu.removed,
      item: { ...menu.item, key: categoryData.key, order: menu.order ?? categoryData.order },
      permissions: menu.permissions,
    };
    await services.menuItem.addItemsFromPlugin(menuItem, false, categoriesMenu.key, {
      transacting,
    });

    return newCategory;
  } catch (e) {
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to register category: ${e.message}`);
  }
}

module.exports = { add };
