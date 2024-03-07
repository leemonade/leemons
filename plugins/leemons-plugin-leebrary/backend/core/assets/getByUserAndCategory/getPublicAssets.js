/**
 * Fetches public assets based on the provided parameters.
 *
 * @async
 * @param {object} params - The parameters object.
 * @param {boolean} params.includePublic - Flag to include public assets in the response.
 * @param {string} params.categoryId - The ID of the category to fetch assets from.
 * @param {boolean} params.indexable - Flag to include indexable assets in the response.
 * @param {MoleculerContext} ctx - The Moleculer context.
 * @returns {Promise<Array>} An array of public assets.
 */
async function getPublicAssets({ includePublic, categoryId, indexable, ctx }) {
  let publicAssets = [];

  if (includePublic) {
    publicAssets = await ctx.tx.db.Assets.find({ category: categoryId, public: true, indexable })
      .select(['id'])
      .lean();
  }

  return publicAssets;
}
module.exports = { getPublicAssets };
