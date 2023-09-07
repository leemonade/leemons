/* eslint-disable no-param-reassign */
const { duplicate: duplicateFile } = require('../../files/duplicate');
/**
 * Handles the duplication of the cover associated with a given asset.
 * It duplicates the cover file and updates the new asset with the duplicated cover.
 *
 * @param {Object} params - An object containing the parameters
 * @param {Object} params.newAsset - The new asset object
 * @param {Object} params.cover - The cover file object
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<Object>} - Returns a promise with the updated asset
 */
async function handleCoverDuplication({ newAsset, cover, ctx }) {
  const newCover = await duplicateFile({ file: cover, ctx });
  if (newCover) {
    await ctx.tx.db.Assets.updateOne({ id: newAsset.id }, { cover: newCover.id });
    newAsset.cover = newCover;
  }
  return newAsset;
}

module.exports = { handleCoverDuplication };
