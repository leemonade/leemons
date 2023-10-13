const { uniq } = require('lodash');

/*
  === Assets, Assignables, Instances and Assignations fetching ===
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
