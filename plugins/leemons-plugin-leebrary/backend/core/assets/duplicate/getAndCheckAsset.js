const { LeemonsError } = require('leemons-error');

/**
 * Retrieves an asset by its ID from the database.
 *
 * @param {object} params - The parameters object
 * @param {string} params.assetId - The ID of the asset
 * @param {object} params.transacting - The transaction object
 * @returns {object} - Returns the asset object
 * @throws {HttpError} - Throws an HTTP error if the asset is not found
 */
async function getAndCheckAsset({ assetId, ctx }) {
  const asset = await ctx.tx.db.Assets.findOne({ id: assetId }).lean();
  if (!asset) throw new LeemonsError(ctx, { message: 'Asset not found', httpStatusCode: 422 });
  return asset;
}

module.exports = { getAndCheckAsset };
