/**
 * Retrieves tags associated with a given asset.
 *
 * @param {Object} params - An object containing the parameters
 * @param {string} params.assetId - The ID of the asset
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} - Returns a promise with an array of tags
 */
async function handleTags({ assetId, ctx }) {
  const [tags] = await ctx.tx.call('common.tags.getValuesTags', {
    values: assetId,
    type: ctx.prefixPN(''),
  });
  return tags;
}

module.exports = { handleTags };
