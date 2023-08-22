const { tables } = require('../tables');

/**
 * Fetches a category by its key.
 *
 * @param {string} key - The key of the category.
 * @param {Object} [options] - Optional parameters.
 * @param {Array} [options.columns] - The columns to be returned in the result set.
 * @param {Object} [options.transacting] - The transaction object.
 * @returns {Promise<Object>} A promise that resolves to the category object.
 * @throws {Error} Throws an error if the operation fails.
 */
async function getByKey(key, { columns, transacting } = {}) {
  const category = await tables.categories.findOne({ key }, { columns, transacting });
  if (category && category.canUse) category.canUse = JSON.parse(category.canUse);
  return category;
}

module.exports = { getByKey };
