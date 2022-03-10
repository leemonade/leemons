const { assetCategories } = require('../../tables');
const assetsDetails = require('../details');

module.exports = async function getAssets(category, { details = false, assets, transacting } = {}) {
  try {
    const query = {
      category,
    };

    if (assets) {
      query.asset_$in = assets;
    }
    let _assets = await assetCategories.find(query, { transacting });
    _assets = _assets.map(({ asset }) => asset);

    if (details) {
      return assetsDetails(_assets, { transacting });
    }
    return _assets;
  } catch (e) {
    throw new Error(`Failed to get category assets: ${e.message}`);
  }
};
