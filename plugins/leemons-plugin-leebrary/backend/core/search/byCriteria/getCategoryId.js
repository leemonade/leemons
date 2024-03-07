const { isLRN } = require('@leemons/lrn');

const { getById: getCategoryById } = require('../../categories/getById');
const { getByKey: getCategoryByKey } = require('../../categories/getByKey');

/**
 * This function fetches a specific category ID based on the provided category input.
 * If the category input is an LRN, the function fetches the category using its ID.
 * If the category input is not an LRN, the function fetches the category using its key.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.category - The category input, which can be either an LRN or a key.
 * @param {MoleculerContext} params.ctx - The Moleculer service context.
 * @returns {Promise<string|null>} - Returns the ID of the category if found, otherwise returns null.
 */
async function getCategoryId({ category, ctx }) {
  let categoryId;
  if (typeof category === 'string') {
    let _category;

    if (isLRN(category)) {
      _category = await getCategoryById({ id: category, columns: ['id'], ctx });
    } else {
      _category = await getCategoryByKey({ key: category, columns: ['id'], ctx });
    }
    categoryId = _category.id;
  }

  return categoryId;
}

module.exports = {
  getCategoryId,
};
