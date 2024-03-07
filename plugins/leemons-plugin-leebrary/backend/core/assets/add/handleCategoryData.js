/* eslint-disable no-param-reassign */
const { isEmpty, isString } = require('lodash');
const { isLRN } = require('@leemons/lrn');
const { getById: getCategoryById } = require('../../categories/getById');
const { getByKey: getCategoryByKey } = require('../../categories/getByKey');

/**
 * Handles the category data.
 *
 * This function fetches the category by its ID or key depending on the parameters passed:
 * - If the 'category' is empty, it uses the 'categoryId' or 'categoryKey' to fetch the category data.
 * - If the 'category' is a string and matches the UUID standard format, it assumes this is a category ID and fetches by ID.
 * - If the 'category' is a string but doesn't match the UUID standard format, it assumes this is a category key and fetches by key.
 * - If the 'category' is a not empty object, it's returned as-is.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {string | Object} [params.category] - The category (either a UUID string, key string, or category object). Optional.
 * @param {string} [params.categoryId] - The ID of the category. Must be a UUID in standard representation. Optional.
 * @param {string} [params.categoryKey] - The key of the category. Optional.
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<LibraryCategory>} The retrieved or provided category data.
 */
async function handleCategoryData({ category, categoryId, categoryKey, ctx }) {
  if (isEmpty(category)) {
    if (!isEmpty(categoryId)) {
      category = await getCategoryById({ id: categoryId, ctx });
    } else {
      category = await getCategoryByKey({ key: categoryKey, ctx });
    }
  } else if (isString(category)) {
    if (isLRN(category)) {
      category = await getCategoryById({ id: category, ctx });
    } else {
      category = await getCategoryByKey({ key: category, ctx });
    }
  } else if (categoryKey) {
    await getCategoryByKey({ key: categoryKey, ctx });
  }
  return category;
}

module.exports = { handleCategoryData };
