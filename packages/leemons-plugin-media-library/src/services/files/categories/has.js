const { fileCategories } = require('../../tables');

module.exports = async function has(asset, category, { transacting } = {}) {
  const { name } = category;
  const { id } = asset;

  const count = await fileCategories.count({ asset: id, category: name }, { transacting });
  return count > 0;
};
