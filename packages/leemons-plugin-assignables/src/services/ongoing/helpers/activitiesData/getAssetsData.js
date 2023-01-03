const { uniq } = require('lodash');

/*
  === Assets, Assignables, Instances and Assignations fetching ===
*/

async function getAssetsData(assets, { userSession, transacting }) {
  const uniqAssets = uniq(assets);

  const assetsData = await leemons.getPlugin('leebrary').services.assets.getByIds(uniqAssets, {
    withTags: false,
    withCategory: false,
    checkPins: false,
    userSession,
    showPublic: true,
    transacting,
  });

  const assetsObj = {};

  assetsData.forEach((asset) => {
    assetsObj[asset.id] = asset;
  });

  return assetsObj;
}

module.exports = { getAssetsData };
