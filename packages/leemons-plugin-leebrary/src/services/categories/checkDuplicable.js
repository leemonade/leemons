const { getById } = require('./getById');

/**
 * This function checks if a category is duplicable. If the category is not duplicable, it throws an HTTP error.
 * @param {object} params - An object containing the parameters for the function.
 * @param {string} params.categoryId - The ID of the category to check.
 * @param {object} params.transacting - The transaction object for the database operation.
 * @throws {HttpError} - If the category is not duplicable, an HTTP error is thrown.
 * @returns {object} - Returns the category if it is duplicable.
 */
async function checkDuplicable({ categoryId, transacting }) {
  const category = await getById(categoryId, { transacting });
  if (!category?.duplicable) {
    throw new global.utils.HttpError(401, 'Assets in this category cannot be duplicated');
  }

  return category;
}

module.exports = { checkDuplicable };
