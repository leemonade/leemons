const { tables } = require('../tables');

/**
 * Asynchronously removes a category from the database.
 *
 * @async
 * @function remove
 * @param {Object} category - The category object to be removed.
 * @param {string} category.key - The key of the category to be removed.
 * @param {Object} [options] - An object containing additional parameters.
 * @param {Object} options.transacting - The transaction object for the database operation.
 * @returns {Promise<Object>} Returns a promise that resolves to the deleted category object.
 * @throws {HttpError} Throws an HttpError if the operation fails.
 */
async function remove(category, { transacting } = {}) {
  const { key } = category;

  try {
    const deleted = await tables.categories.deleteMany({ key }, { transacting });
    return deleted;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to remove category: ${e.message}`);
  }
}

module.exports = { remove };
