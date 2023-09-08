const { normalizeItemsArray } = require('../../shared');

/**
 * Removes files and associated assets from the database.
 *
 * @param {object} params - The params object.
 * @param {Array|string} params.fileIds - The IDs of the files to be removed.
 * @param {string} params.assetId - The ID of the associated asset.
 * @param {boolean} [params.soft] - Whether to perform a soft delete. Default to false.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating whether the operation was successful.
 */
async function remove({ fileIds, assetId, soft, ctx }) {
  const query = { file: normalizeItemsArray(fileIds) };

  if (assetId) {
    query.asset = assetId;
  }

  const deleted = await ctx.tx.db.AssetsFiles.deleteMany(query, { soft });
  return deleted.deletedCount > 0;
}

module.exports = { remove };
