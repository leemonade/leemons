const { LeemonsError } = require('@leemons/error');

const { getByAsset } = require('../getByAsset');

/**
 * Removes a pin by asset ID.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {boolean} params.soft - Determines if the deletion should be soft.
 * @param {Context} params.ctx - The Moleculer context object.
 * @returns {Promise<LibraryPin>} A promise that resolves with the removed pin document.
 */
async function removeByAsset({ assetId, soft, ctx }) {
  const pin = await getByAsset({ assetId, ctx });

  if (!pin) {
    throw new LeemonsError(ctx, { message: 'Pin not found', httpStatusCode: 404 });
  }

  try {
    return await ctx.tx.db.Pins.deleteOne({ id: pin.id }, { soft });
  } catch (e) {
    throw new LeemonsError(ctx, { message: 'Failed to remove Pin', httpStatusCode: 500 });
  }
}

module.exports = { removeByAsset };
