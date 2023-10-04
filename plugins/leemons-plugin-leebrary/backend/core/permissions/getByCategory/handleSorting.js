const { sortBy } = require('lodash');
const { getByIds } = require('../../assets/getByIds');
const { getByAssets } = require('../getByAssets/getByAssets');

/**
 * This function sorts assets based on the provided parameters.
 *
 * @param {Object} params - An object containing the following properties:
 * @param {Array} params.assetIds - An array of asset IDs to be sorted.
 * @param {Boolean} params.indexable - A boolean indicating if the assets are indexable.
 * @param {Boolean} params.showPublic - A boolean indicating if the assets are public.
 * @param {Object} params.userSession - An object representing the user's session.
 * @param {String} params.sortingBy - A string indicating the property to sort the assets by.
 * @param {String} params.sortDirection - A string indicating the direction of the sort ('asc' or 'desc').
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<Array>} - Returns an array of sorted asset accessibles.
 */
async function handleSorting({
  assetIds,
  indexable,
  showPublic,
  userSession,
  sortingBy,
  sortDirection,
  ctx,
}) {
  if (!assetIds?.length) return [];

  const [assets, assetsAccessibles] = await Promise.all([
    getByIds({
      ids: assetIds,
      withCategory: false,
      withTags: false,
      indexable,
      showPublic,
      ctx,
    }),
    getByAssets({ assetIds, showPublic, userSession, ctx }),
  ]);

  let sortedAssets = sortBy(assets, sortingBy);

  if (sortDirection === 'desc') {
    sortedAssets = sortedAssets.reverse();
  }

  const sortedIds = sortedAssets.map((item) => item.id);

  return assetsAccessibles.sort((a, b) => sortedIds.indexOf(a.asset) - sortedIds.indexOf(b.asset));
}

module.exports = { handleSorting };
