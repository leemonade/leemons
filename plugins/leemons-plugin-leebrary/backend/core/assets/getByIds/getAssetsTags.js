/**
 * Fetches tags associated with each asset
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch tags for
 * @param {MoleculerContext} params.ctx - The Moleculer context
 * @returns {Promise<Array>} - Returns an array of tags associated with each asset
 */
async function getAssetsTags({ assets, ctx }) {
  return Promise.all(
    assets.map((item) =>
      ctx.tx.call('common.tags.getValuesTags', {
        type: ctx.prefixPN(''),
        values: item.id,
      })
    )
  );
}

module.exports = { getAssetsTags };
