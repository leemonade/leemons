const { find: findAssets } = require('../../find');
/**
 * Checks if the asset is public.
 *
 * @param {object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the asset is public.
 */
async function handleIsPublic({ assetId, ctx }) {
  const [asset] = await findAssets({ query: { id: assetId }, ctx });
  return asset?.public;
}

module.exports = { handleIsPublic };
