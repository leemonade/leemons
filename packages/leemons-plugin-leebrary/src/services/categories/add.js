const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { exists } = require('./exists');
const { categoriesMenu } = require('../../../config/constants');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Validate the category data.
 * @param {Object} categoryData - The category data to validate.
 * @throws {HttpError} If the validation fails.
 */
function validateCategoryData(categoryData) {
  if (isEmpty(categoryData.key)) {
    throw new global.utils.HttpError(400, 'Category `key` is required');
  }

  if (isEmpty(categoryData.menu)) {
    throw new global.utils.HttpError(400, 'Category `menu` is required');
  }
}

/**
 * Create a new category if it does not exist.
 * @param {Object} categoryData - The category data.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Object>} The promise that resolves to the new category.
 */
async function createCategoryIfNotExist(categoryData, transacting) {
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
  return newCategory;
}

/**
 * Add a menu item.
 * @param {Object} menu - The menu data.
 * @param {Object} categoryData - The category data.
 * @param {Object} transacting - The transaction object.
 */
async function addMenuItem(menu, categoryData, transacting) {
  const { services } = leemons.getPlugin('menu-builder');
  const menuItem = {
    removed: menu.removed,
    item: { ...menu.item, key: categoryData.key, order: menu.order ?? categoryData.order },
    permissions: menu.permissions,
  };
  await services.menuItem.addItemsFromPlugin(menuItem, false, categoriesMenu.key, {
    transacting,
  });
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Add a category.
 * @param {Object} data - The data to add.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The promise that resolves to the new category.
 * @throws {HttpError} If the addition fails.
 */
async function add(data, { transacting } = {}) {
  const { menu, ...categoryData } = data;

  validateCategoryData(categoryData);

  try {
    const newCategory = await createCategoryIfNotExist(categoryData, transacting);

    await addMenuItem(menu, categoryData, transacting);

    return newCategory;
  } catch (e) {
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to register category: ${e.message}`);
  }
}

module.exports = { add };
