/**
 * Retrieves a category by its ID.
 *
 * @async
 * @function getById
 * @param {Object} options - Input options.
 * @param {string} options.id - The ID of the category to retrieve.
 * @param {string[]} [options.columns] - The optional columns to select from the category.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object|null>} The category object or null if not found.
 *
 * @example
 * // Usage example:
 * const category = await getById({ id: 'category-id', columns: ['name', 'description'], ctx });
 * // category will contain the retrieved category object with specified columns.
 */
async function getById({ id, columns, ctx }) {
  const category = await ctx.tx.db.Categories.findOne({ id }).select(columns).lean();
  if (category && category.canUse) category.canUse = JSON.parse(category.canUse);
  return category;
}

module.exports = { getById };
