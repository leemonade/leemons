const { assetCategories } = require('../../tables');

module.exports = async function getAssets(category, { transacting } = {}) {
  const { name } = category;
  try {
    const assets = await assetCategories.find({ category: name }, { transacting });
    return assets.map(({ asset }) => asset);
  } catch (e) {
    throw new Error(`Failed to get category assets: ${e.message}`);
  }
};
