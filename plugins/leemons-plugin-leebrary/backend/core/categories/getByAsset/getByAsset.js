const { LeemonsError } = require('@leemons/error');
const { getByIds } = require('../getByIds');

/**
 * Retrieves categories by asset. If the operation fails, it throws an HTTP error.
 *
 * @async
 * @function getByAsset
 * @param {Object} params - The main parameter object.
 * @param {string} params.assetId - The id of the asset.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The categories if they are successfully retrieved.
 * @throws {LeemonsError} If the operation fails, a LeemonsError is thrown.
 */
async function getByAsset({ assetId, ctx }) {
  try {
    //! Originalmente se está llamando a la tabla AssetCategories que no existe
    // const categories = await ctx.tx.db.AssetCategories.find({ asset: assetId });
    //! Lo cambio al modelo Assets que es lo que me parece más lógico

    const assets = await ctx.tx.db.Assets.find({ id: assetId });

    const categoriesIds = assets.map((asset) => asset.category);

    return getByIds({ categoriesIds, ctx });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get categories by asset: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByAsset };
