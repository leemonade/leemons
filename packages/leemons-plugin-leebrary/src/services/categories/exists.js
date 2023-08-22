const { tables } = require('../tables');

/**
 * Checks if a category exists in the database.
 * @async
 * @param {Object} categoryData - The data of the category to check.
 * @param {Object} [transacting] - The transaction object.
 * @returns {Promise<boolean>} The promise that resolves to a boolean indicating whether the category exists.
 */
async function exists(categoryData, { transacting } = {}) {
  const query = {};
  if (categoryData.id) {
    query.id = categoryData.id;
  }

  if (categoryData.key) {
    query.key = categoryData.key;
  }

  const count = await tables.categories.count(query, { transacting });
  return count > 0;
}

module.exports = { exists };
