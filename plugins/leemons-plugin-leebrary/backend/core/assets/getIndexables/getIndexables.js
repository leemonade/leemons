/**
 * Retrieves indexable assets based on provided asset IDs and selected columns.
 *
 * @async
 * @function getIndexables
 * @param {Object} params - Parameters for the function.
 * @param {Array.<string>} params.assetIds - Array of asset IDs to retrieve. Default is an empty array.
 * @param {Array.<string>|string} params.columns - Array of column names to select in the query.
 * @param {MoleculerContext} params.ctx - Moleculer context.
 * @returns {Promise<Array.<Object>>} Array of indexable assets.
 */

async function getIndexables({ assetIds = [], columns, ctx }) {
  return ctx.tx.db.Assets.find({ id: assetIds, indexable: true }).select(columns).lean();
}

module.exports = { getIndexables };
