const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByKey } = require('./getByKey');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Checks if the category key is empty.
 * @param {string} categoryKey - The key of the category.
 * @throws {HttpError} If the category key is empty.
 */
function checkCategoryKey(categoryKey) {
  if (isEmpty(categoryKey)) {
    throw new global.utils.HttpError(400, 'Category key is required.');
  }
}

/**
 * Checks if the category exists.
 * @param {string} categoryKey - The key of the category.
 * @param {Object} transacting - The transaction object for the database operation.
 * @returns {Promise<Object>} The category object.
 * @throws {HttpError} If the category does not exist.
 */
async function checkCategoryExists(categoryKey, transacting) {
  const category = await getByKey(categoryKey, { transacting });
  if (!category || isEmpty(category)) {
    throw new global.utils.HttpError(400, 'Category not found.');
  }
  return category;
}

/**
 * Checks if the category has assets.
 * @param {Object} category - The category object.
 * @param {Object} transacting - The transaction object for the database operation.
 * @throws {HttpError} If the category has assets.
 */
async function checkCategoryAssets(category, transacting) {
  const assets = await tables.assets.find({ category: category.id }, { transacting });
  if (!isEmpty(assets)) {
    throw new global.utils.HttpError(400, 'Category has assets.');
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Removes a category by its key.
 * @param {string} categoryKey - The key of the category.
 * @param {Object} transacting - The transaction object for the database operation.
 * @returns {Promise<Object>} Returns a promise that resolves to the deleted category object.
 * @throws {HttpError} Throws an HttpError if the operation fails.
 */
async function removeByKey(categoryKey, { transacting } = {}) {
  checkCategoryKey(categoryKey);
  const category = await checkCategoryExists(categoryKey, transacting);
  await checkCategoryAssets(category, transacting);

  try {
    const deleted = await tables.categories.deleteMany({ key: categoryKey }, { transacting });
    return deleted;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to remove category: ${e.message}`);
  }
}

module.exports = { removeByKey };
