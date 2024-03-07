const { LeemonsError } = require('@leemons/error');

/**
 * Retrieves an asset by its ID from the database.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} - Returns a promise that resolves to the asset object.
 * @throws {LeemonsError} - Throws a LeemonsError if the asset is not found.
 */
async function getAndCheckAsset({ assetId, ctx }) {
  const asset = await ctx.tx.db.Assets.findOne({ id: assetId }).lean();
  if (!asset) throw new LeemonsError(ctx, { message: 'Asset not found', httpStatusCode: 422 });
  return asset;
}

module.exports = { getAndCheckAsset };
