const { assetCategories } = require('../../tables');

module.exports = async function has(asset, category, { transacting } = {}) {
  const { name } = category;
  const { id } = asset;

  const count = await assetCategories.count({ asset: id, category: name }, { transacting });
  return count > 0;
};
