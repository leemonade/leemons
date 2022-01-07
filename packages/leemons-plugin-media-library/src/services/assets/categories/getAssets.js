const { assetCategories } = require('../../tables');

module.exports = async function getAssets(category, { assets, transacting } = {}) {
  try {
    const query = {
      category,
    };

    if (assets) {
      query.asset_$in = assets;
    }
    const _assets = await assetCategories.find(query, { transacting });
    return _assets.map(({ asset }) => asset);
  } catch (e) {
    throw new Error(`Failed to get category assets: ${e.message}`);
  }
};
