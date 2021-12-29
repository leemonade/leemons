const { fileCategories } = require('../../tables');

module.exports = async function remove(asset, category, { transacting } = {}) {
  const { name } = category;
  const { id } = asset;

  try {
    const deleted = await fileCategories.deleteMany({ asset: id, category: name }, { transacting });
    return {
      deleted: deleted.count,
      soft: deleted.soft,
    };
  } catch (e) {
    throw new Error(`Failed to delete category: ${e.message}`);
  }
};
