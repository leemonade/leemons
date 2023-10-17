/**
 * Get a bookmark by asset
 *
 * @param {string} assetId - The ID of the asset to get the bookmark for
 * @param {Array<string>} columns - The columns to select in the query
 * @param {MoleculerContext} ctx - The moleculer context
 * @returns {Promise<object>} - Returns the bookmark
 */
async function getByAsset({ assetId, columns, ctx }) {
  return ctx.tx.db.Bookmarks.findOne({ asset: assetId }).select(columns).lean();
}

module.exports = { getByAsset };
