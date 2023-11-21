/**
 * Retrieves a category by its ID. If the category can be used, it parses the 'canUse' field from a string to a JSON object.
 *
 * @async
 * @function getById
 * @param {Object} params - The main parameter object.
 * @param {string} params.id - The ID of the category to retrieve.
 * @param {Array<string>} params.columns - The columns to select in the query.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The category if it is found, null otherwise.
 * @throws {LeemonsError} If the required fields are not provided, a LeemonsError is thrown.
 */
async function getById({ id, columns, ctx }) {
  const category = await ctx.tx.db.Categories.findOne({ id }).select(columns).lean();
  if (category?.canUse) category.canUse = JSON.parse(category.canUse || null);
  return category;
}

module.exports = { getById };
