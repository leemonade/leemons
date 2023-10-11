const { map } = require('lodash');

/**
 * This function filters out the results based on the indexability of the assets.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.results - The results to be filtered.
 * @param {MoleculerContext} params.ctx - The context object containing the transaction and database information.
 * @returns {Promise<Array<String>>} - Returns the filtered results.
 */
async function handleIndexable({ results, ctx }) {
  const indexableAssetsIds = await ctx.tx.db.Assets.find({
    id: map(results, 'asset'),
    indexable: true,
  })
    .select(['id'])
    .lean();

  const indexableAssetsObject = indexableAssetsIds.reduce(
    (obj, { id }) => ({ ...obj, [id]: true }),
    {}
  );

  return results.filter(({ asset }) => indexableAssetsObject[asset]);
}

module.exports = { handleIndexable };
