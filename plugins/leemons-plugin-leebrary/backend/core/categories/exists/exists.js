/**
 * Checks if a category exists based on the provided category data.
 *
 * @async
 * @function exists
 * @param {Object} params - The main parameter object.
 * @param {Object} params.categoryData - The data of the category to check.
 * @param {string} params.categoryData.id - The id of the category.
 * @param {string} params.categoryData.key - The key of the category.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} Returns true if the category exists, false otherwise.
 * @throws {LeemonsError} If the required fields are not provided, a LeemonsError is thrown.
 */
async function exists({ categoryData, ctx }) {
  const query = {};
  if (categoryData.id) {
    query.id = categoryData.id;
  }

  if (categoryData.key) {
    query.key = categoryData.key;
  }

  const count = await ctx.tx.db.Categories.countDocuments(query);
  return count > 0;
}

module.exports = { exists };
