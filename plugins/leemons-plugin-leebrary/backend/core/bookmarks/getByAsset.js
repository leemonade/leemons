/**
 * Retrieves a bookmark by its associated asset ID.
 *
 * @async
 * @function getByAsset
 * @param {Object} options - Input options.
 * @param {string} options.assetId - The ID of the asset associated with the bookmark.
 * @param {string[]} [options.columns] - The optional columns to select from the bookmark.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object|null>} The bookmark object or null if not found.
 */
async function getByAsset({ assetId, columns, ctx }) {
  return ctx.tx.db.Bookmarks.findOne({ asset: assetId }).select(columns).lean();
}

module.exports = { getByAsset };
