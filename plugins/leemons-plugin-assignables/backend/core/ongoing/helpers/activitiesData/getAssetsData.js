const { uniq } = require('lodash');

/*
  === Assets, Assignables, Instances and Assignations fetching ===
*/
/**
 * This function is used to get the data of assets.
 * @async
 * @function getAssetsData
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.assets - The assets to get data for.
 * @param {Moleculer.Context} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} A promise that resolves to an object of assets data.
 */

async function getAssetsData({ assets, ctx }) {
  const uniqAssets = uniq(assets);

  const assetsData = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: uniqAssets,
    withTags: false,
    withCategory: false,
    checkPins: false,
    showPublic: true,
  });

  const assetsObj = {};

  assetsData.forEach((asset) => {
    assetsObj[asset.id] = asset;
  });

  return assetsObj;
}

module.exports = { getAssetsData };
