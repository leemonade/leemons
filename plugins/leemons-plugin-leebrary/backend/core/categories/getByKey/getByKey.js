/**
 * Retrieves a category by its key.
 *
 * @async
 * @function getByKey
 * @param {Object} params - The main parameter object.
 * @param {string} params.key - The key of the category to retrieve.
 * @param {Array<string>} params.columns - The columns to select.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The category corresponding to the provided key.
 */
async function getByKey({ key, columns, ctx }) {
  const category = await ctx.tx.db.Categories.findOne({ key }).select(columns).lean();
  if (category?.canUse) category.canUse = JSON.parse(category.canUse || null);

  return category;
}

module.exports = { getByKey };
