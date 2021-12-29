const { fileCategories } = require('../../tables');
const has = require('./has');

module.exports = async function add(asset, category, { transacting } = {}) {
  const { name } = category;
  const { id } = asset;

  try {
    if (!(await has(asset, category, { transacting }))) {
      await fileCategories.create({ asset: id, category: name }, { transacting });
      return true;
    }
    return false;
  } catch (e) {
    throw new Error(`Failed to add category: ${e.message}`);
  }
};
