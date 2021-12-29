const { fileCategories } = require('../../tables');

module.exports = async function get(asset, { transacting } = {}) {
  const { id } = asset;
  try {
    const categories = await fileCategories.find({ asset: id }, { transacting });
    return categories.map(({ category }) => category);
  } catch (e) {
    throw new Error(`Failed to get categories: ${e.message}`);
  }
};
