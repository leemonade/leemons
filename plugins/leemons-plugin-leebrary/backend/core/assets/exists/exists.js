/**
 * Check if an asset exists by its ID
 *
 * @param {object} params - The params object
 * @param {string} params.assetId - The ID of the asset
 * @param {MoleculerContext} params.ctx - The Moleculer context
 * @returns {Promise<boolean>} - Returns true if the asset exists, false otherwise
 */

async function exists({ assetId, ctx }) {
  if (!assetId?.length) return false;
  const count = await ctx.tx.db.Assets.countDocuments({ id: assetId });
  return count > 0;
}

module.exports = { exists };
